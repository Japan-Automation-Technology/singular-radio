import type { Episode } from "@/lib/data";
import { formatIsoDuration } from "@/lib/time";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

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

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${body}`);
  }
  return (await res.json()) as T;
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
  const url = new URL(`${YOUTUBE_API_BASE}/videos`);
  url.searchParams.set("part", "snippet,contentDetails,statistics");
  url.searchParams.set("id", id);
  url.searchParams.set("key", apiKey);
  const data = await fetchJson<VideoListResponse>(url.toString());
  const item = data.items?.[0];
  if (!item) return null;
  return mapVideoToEpisode(item);
}
