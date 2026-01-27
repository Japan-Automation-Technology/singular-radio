import type { Episode, TranscriptSegment } from "@/lib/data";
import { formatIsoDuration } from "@/lib/time";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_TIMEDTEXT_BASE = "https://www.youtube.com/api/timedtext";
const TRANSCRIPT_CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
const TRANSCRIPT_BACKOFF_MS = 1000 * 60 * 10; // 10 minutes

type TranscriptCacheEntry = {
  segments: TranscriptSegment[];
  fetchedAt: number;
  errorUntil?: number;
};

const transcriptCache = new Map<string, TranscriptCacheEntry>();

type PlaylistItemResponse = {
  items?: Array<{
    contentDetails?: { videoId?: string };
  }>;
  nextPageToken?: string;
};

type VideoListResponse = {
  items?: Array<{
    id?: string;
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      thumbnails?: Record<string, { url?: string }>;
      tags?: string[];
    };
    contentDetails?: { duration?: string };
    statistics?: {
      viewCount?: string;
      likeCount?: string;
      commentCount?: string;
    };
  }>;
};

function getEnv(name: string): string | null {
  return process.env[name] ?? null;
}

export function hasYoutubeConfig(): boolean {
  return Boolean(getEnv("YOUTUBE_API_KEY") && getEnv("YOUTUBE_PLAYLIST_ID"));
}

function pickThumbnail(
  thumbnails?: Record<string, { url?: string }>
): string | undefined {
  return (
    thumbnails?.maxres?.url ??
    thumbnails?.standard?.url ??
    thumbnails?.high?.url ??
    thumbnails?.medium?.url ??
    thumbnails?.default?.url
  );
}

function summarizeDescription(description?: string): string {
  if (!description) return "";
  const firstLine = description.split("\n")[0].trim();
  if (!firstLine) return "";
  if (firstLine.length <= 140) return firstLine;
  return `${firstLine.slice(0, 137)}...`;
}

function toNumber(value?: string): number | undefined {
  if (!value) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function parseVttTime(value: string): number | null {
  const match = value.match(/(?:(\d+):)?(\d{2}):(\d{2})\.(\d{3})/);
  if (!match) return null;
  const h = Number(match[1] ?? 0);
  const m = Number(match[2]);
  const s = Number(match[3]);
  const ms = Number(match[4]);
  if (![h, m, s, ms].every(Number.isFinite)) return null;
  return h * 3600 + m * 60 + s + ms / 1000;
}

function stripVttTags(text: string): string {
  return text.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function parseXmlToSegments(xml: string, idPrefix: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  const re = /<text\b([^>]*)>([\s\S]*?)<\/text>/g;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = re.exec(xml))) {
    const attrs = match[1] ?? "";
    const text = decodeXmlEntities((match[2] ?? "").trim());
    if (!text) continue;
    const startMatch = attrs.match(/start="([\d.]+)"/);
    const durMatch = attrs.match(/dur="([\d.]+)"/);
    const start = startMatch ? Number(startMatch[1]) : NaN;
    const dur = durMatch ? Number(durMatch[1]) : NaN;
    if (!Number.isFinite(start)) continue;
    const end = Number.isFinite(dur) ? start + dur : start;
    segments.push({
      id: `${idPrefix}-${index}`,
      text,
      start,
      end,
    });
    index += 1;
  }
  return segments;
}

function parseVttToSegments(vtt: string, idPrefix: string): TranscriptSegment[] {
  const lines = vtt.split(/\r?\n/);
  const segments: TranscriptSegment[] = [];
  let start: number | null = null;
  let end: number | null = null;
  let buffer: string[] = [];
  let index = 0;

  const flush = () => {
    if (start === null || end === null) return;
    const text = stripVttTags(buffer.join(" ").trim());
    if (!text) return;
    segments.push({
      id: `${idPrefix}-${index}`,
      text,
      start,
      end,
    });
    index += 1;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      start = null;
      end = null;
      buffer = [];
      continue;
    }
    if (line.includes("-->")) {
      const [s, e] = line.split("-->").map((part) => part.trim());
      start = parseVttTime(s);
      end = parseVttTime(e.split(" ")[0] ?? "");
      buffer = [];
      continue;
    }
    if (start !== null && end !== null) {
      buffer.push(line);
    }
  }
  flush();
  return segments;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${body}`);
  }
  return (await res.json()) as T;
}

async function fetchTranscriptVtt(
  videoId: string,
  lang: string,
  kind?: "asr",
  name?: string
) {
  const url = new URL(YOUTUBE_TIMEDTEXT_BASE);
  url.searchParams.set("v", videoId);
  url.searchParams.set("lang", lang);
  url.searchParams.set("fmt", "vtt");
  if (kind) url.searchParams.set("kind", kind);
  if (name) url.searchParams.set("name", name);

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  const body = await res.text();
  if (!body) return null;
  return body;
}

type CaptionTrack = {
  lang: string;
  name?: string;
  kind?: "asr";
};

async function fetchCaptionTracks(videoId: string): Promise<CaptionTrack[]> {
  const url = new URL(YOUTUBE_TIMEDTEXT_BASE);
  url.searchParams.set("type", "list");
  url.searchParams.set("v", videoId);
  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  console.log("[yt] caption track list status:", res.status, res.statusText);
  if (res.status === 429) return [];
  if (!res.ok) return [];
  const xml = await res.text();
  console.log("[yt] caption track list xml:", xml.slice(0, 2000));
  const tracks: CaptionTrack[] = [];
  const re = /<track\b([^>]+?)\/>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml))) {
    const attrs = match[1] ?? "";
    const langMatch = attrs.match(/lang_code="([^"]+)"/);
    if (!langMatch) continue;
    const nameMatch = attrs.match(/name="([^"]+)"/);
    const kindMatch = attrs.match(/kind="([^"]+)"/);
    tracks.push({
      lang: langMatch[1],
      name: nameMatch ? decodeXmlEntities(nameMatch[1]) : undefined,
      kind: kindMatch?.[1] === "asr" ? "asr" : undefined,
    });
  }
  return tracks;
}

function pickTrack(tracks: CaptionTrack[], lang: string): CaptionTrack | null {
  const exact = tracks.filter((t) => t.lang === lang);
  if (exact.length === 0) return null;
  const manual = exact.find((t) => t.kind !== "asr");
  return manual ?? exact[0];
}

export async function fetchYoutubeTranscriptById(
  videoId: string
): Promise<TranscriptSegment[]> {
  const cached = transcriptCache.get(videoId);
  const now = Date.now();
  if (cached?.errorUntil && cached.errorUntil > now) {
    console.log("[yt] transcript backoff active");
    return cached.segments;
  }
  if (cached && now - cached.fetchedAt < TRANSCRIPT_CACHE_TTL_MS) {
    return cached.segments;
  }

  const langs = ["ja", "en"];
  const tracks = await fetchCaptionTracks(videoId);
  if (tracks.length === 0) {
    transcriptCache.set(videoId, {
      segments: cached?.segments ?? [],
      fetchedAt: now,
      errorUntil: now + TRANSCRIPT_BACKOFF_MS,
    });
    return cached?.segments ?? [];
  }
  const picked =
    pickTrack(tracks, "ja") ?? pickTrack(tracks, "en") ?? tracks[0] ?? null;
  if (!picked) return [];

  const vtt = await fetchTranscriptVtt(videoId, picked.lang, picked.kind, picked.name);
  console.log("[yt] picked track:", picked);
  if (vtt) {
    console.log("[yt] timedtext response head:", vtt.slice(0, 500));
  }
  if (!vtt) return [];
  if (vtt.startsWith("WEBVTT")) {
    const segments = parseVttToSegments(vtt, `yt-${videoId}`);
    transcriptCache.set(videoId, { segments, fetchedAt: now });
    return segments;
  }
  if (vtt.startsWith("<?xml") || vtt.startsWith("<transcript")) {
    const segments = parseXmlToSegments(vtt, `yt-${videoId}`);
    transcriptCache.set(videoId, { segments, fetchedAt: now });
    return segments;
  }
  transcriptCache.set(videoId, { segments: [], fetchedAt: now });
  return [];
}

async function fetchPlaylistVideoIds(playlistId: string, apiKey: string) {
  const ids: string[] = [];
  let pageToken: string | undefined;
  do {
    const url = new URL(`${YOUTUBE_API_BASE}/playlistItems`);
    url.searchParams.set("part", "contentDetails");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const data = await fetchJson<PlaylistItemResponse>(url.toString());
    const pageIds =
      data.items
        ?.map((item) => item.contentDetails?.videoId)
        .filter((id): id is string => Boolean(id)) ?? [];
    ids.push(...pageIds);
    pageToken = data.nextPageToken;
  } while (pageToken);
  return ids;
}

async function fetchVideosByIds(ids: string[], apiKey: string) {
  const items: NonNullable<VideoListResponse["items"]> = [];
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const url = new URL(`${YOUTUBE_API_BASE}/videos`);
    url.searchParams.set("part", "snippet,contentDetails,statistics");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("key", apiKey);
    const data = await fetchJson<VideoListResponse>(url.toString());
    if (data.items) items.push(...data.items);
  }
  return items;
}

function mapVideoToEpisode(item: NonNullable<VideoListResponse["items"]>[number]): Episode | null {
  const id = item.id;
  if (!id) return null;
  const publishedAt = item.snippet?.publishedAt?.slice(0, 10) ?? "";
  const duration = formatIsoDuration(item.contentDetails?.duration);
  const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
  return {
    slug: id,
    title: item.snippet?.title ?? "Untitled",
    guest: undefined,
    publishedAt,
    duration,
    youtubeUrl,
    spotifyUrl: undefined,
    appleUrl: undefined,
    tags: item.snippet?.tags ?? [],
    summary: summarizeDescription(item.snippet?.description),
    transcript: [],
    learnTerms: [],
    thumbnailUrl: pickThumbnail(item.snippet?.thumbnails),
    viewCount: toNumber(item.statistics?.viewCount),
    likeCount: toNumber(item.statistics?.likeCount),
    commentCount: toNumber(item.statistics?.commentCount),
  };
}

export async function fetchYoutubeEpisodes(): Promise<Episode[]> {
  const apiKey = getEnv("YOUTUBE_API_KEY");
  const playlistId = getEnv("YOUTUBE_PLAYLIST_ID");
  if (!apiKey || !playlistId) return [];

  const ids = await fetchPlaylistVideoIds(playlistId, apiKey);
  if (ids.length === 0) return [];

  const items = await fetchVideosByIds(ids, apiKey);
  const itemMap = new Map(items.map((item) => [item.id, item]));
  const episodes = ids
    .map((id) => itemMap.get(id))
    .filter(Boolean)
    .map((item) => mapVideoToEpisode(item!))
    .filter((ep): ep is Episode => Boolean(ep));

  return episodes.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function fetchYoutubeEpisodeById(id: string): Promise<Episode | null> {
  const apiKey = getEnv("YOUTUBE_API_KEY");
  if (!apiKey || !id) return null;
  console.log("[yt] fetchYoutubeEpisodeById", { id });
  const url = new URL(`${YOUTUBE_API_BASE}/videos`);
  url.searchParams.set("part", "snippet,contentDetails,statistics");
  url.searchParams.set("id", id);
  url.searchParams.set("key", apiKey);
  const data = await fetchJson<VideoListResponse>(url.toString());
  const item = data.items?.[0];
  if (!item) return null;
  const episode = mapVideoToEpisode(item);
  if (!episode) return null;
  try {
    console.log("[yt] fetching transcript for", id);
    episode.transcript = await fetchYoutubeTranscriptById(id);
    console.log("[yt] transcript segments", episode.transcript.length);
  } catch (err) {
    console.error("fetchYoutubeTranscript error", err);
  }
  return episode;
}
