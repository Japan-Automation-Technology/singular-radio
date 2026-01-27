import { randomUUID } from "crypto";
import { sanityClient, hasSanity } from "./sanity.client";
import {
  episodesQuery,
  episodeBySlugQuery,
  learnTermsQuery,
  learnTermBySlugQuery,
} from "./queries";
import { episodes as mockEpisodes, learnTerms as mockLearn } from "./data";
import { fetchYoutubeEpisodeById, fetchYoutubeEpisodes, hasYoutubeConfig } from "./youtube-data";

export type CmsEpisode = typeof mockEpisodes[number];
export type CmsLearn = typeof mockLearn[number];

type RawEpisode = {
  title: string;
  slug: string;
  guest?: string;
  publishedAt?: string;
  duration?: string;
  summary?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  tags?: string[];
  learnRefs?: { slug: string }[];
  transcript?: {
    segmentId?: string;
    text: string;
    start?: number;
    end?: number;
  }[];
};

type RawLearn = {
  title: string;
  slug: string;
  shortDef?: string;
  longDef?: string;
  categories?: string[];
  occurrences?: { timestamp?: number; episode?: { slug: string } }[];
};

export async function fetchEpisodes(): Promise<CmsEpisode[]> {
  if (hasYoutubeConfig()) {
    try {
      const data = await fetchYoutubeEpisodes();
      if (data.length > 0) return data;
    } catch (err) {
      console.error("fetchYoutubeEpisodes error", err);
    }
  }
  if (!hasSanity || !sanityClient) return mockEpisodes;
  const data: RawEpisode[] = await sanityClient.fetch(episodesQuery);
  return data.map(mapEpisode);
}

export async function fetchEpisodeBySlug(slug: string): Promise<CmsEpisode | null> {
  if (!slug) return null;
  if (!hasSanity || !sanityClient) {
    if (hasYoutubeConfig()) {
      const youtubeEpisode = await fetchYoutubeEpisodeById(slug);
      if (youtubeEpisode) return youtubeEpisode;
    }
    return mockEpisodes.find((e) => e.slug === slug) ?? null;
  }
  try {
    const data: RawEpisode | null = await sanityClient.fetch(episodeBySlugQuery, {
      slug: String(slug),
    });
    if (data) return mapEpisode(data);
    if (hasYoutubeConfig()) {
      const youtubeEpisode = await fetchYoutubeEpisodeById(slug);
      if (youtubeEpisode) return youtubeEpisode;
    }
    return null;
  } catch (err) {
    console.error("fetchEpisodeBySlug error", err);
    return null;
  }
}

export async function fetchLearnTerms(): Promise<CmsLearn[]> {
  if (!hasSanity || !sanityClient) return mockLearn;
  const data: RawLearn[] = await sanityClient.fetch(learnTermsQuery);
  return data.map(mapLearn);
}

export async function fetchLearnBySlug(slug: string): Promise<CmsLearn | null> {
  if (!hasSanity || !sanityClient) {
    return mockLearn.find((t) => t.slug === slug) ?? null;
  }
  const data: RawLearn | null = await sanityClient.fetch(learnTermBySlugQuery, { slug });
  return data ? mapLearn(data) : null;
}

function mapEpisode(raw: RawEpisode): CmsEpisode {
  return {
    slug: raw.slug,
    title: raw.title,
    guest: raw.guest,
    publishedAt: raw.publishedAt?.slice(0, 10) ?? "",
    duration: raw.duration ?? "",
    thumbnailUrl: undefined,
    youtubeUrl: raw.youtubeUrl,
    spotifyUrl: raw.spotifyUrl,
    appleUrl: raw.appleUrl,
    externalUrl: undefined,
    viewCount: undefined,
    likeCount: undefined,
    commentCount: undefined,
    tags: raw.tags ?? [],
    summary: raw.summary ?? "",
    transcript: (raw.transcript ?? []).map((seg) => ({
      id: seg.segmentId || randomUUID(),
      text: seg.text,
      start: seg.start ?? 0,
      end: seg.end ?? 0,
    })),
    learnTerms: (raw.learnRefs ?? []).map((r) => r.slug),
  };
}

function mapLearn(raw: RawLearn): CmsLearn {
  return {
    slug: raw.slug,
    title: raw.title,
    shortDef: raw.shortDef ?? "",
    longDef: raw.longDef ?? "",
    categories: raw.categories ?? [],
    occurrences:
      (raw.occurrences ?? [])
        .filter((occ) => occ.episode?.slug)
        .map((occ) => ({
          episode: occ.episode!.slug,
          timestamp: occ.timestamp ?? 0,
        })),
  };
}
