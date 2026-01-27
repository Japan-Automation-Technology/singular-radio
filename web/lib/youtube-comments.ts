const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

type CommentThreadResponse = {
  items?: Array<{
    snippet?: {
      topLevelComment?: {
        id?: string;
        snippet?: {
          textDisplay?: string;
          textOriginal?: string;
          authorDisplayName?: string;
          authorChannelId?: { value?: string };
          authorChannelUrl?: string;
          authorProfileImageUrl?: string;
          likeCount?: number;
          publishedAt?: string;
          updatedAt?: string;
        };
      };
      totalReplyCount?: number;
    };
  }>;
  nextPageToken?: string;
};

export type YoutubeComment = {
  id: string;
  videoId: string;
  text: string;
  authorName: string;
  authorChannelId: string;
  authorChannelUrl?: string;
  likeCount?: number;
  replyCount?: number;
  publishedAt?: string;
  updatedAt?: string;
};

function getEnv(name: string): string | null {
  return process.env[name] ?? null;
}

export function getYoutubeApiKey(): string | null {
  return getEnv("YOUTUBE_API_KEY");
}

export async function fetchYoutubeCommentsForVideo(
  videoId: string,
  apiKey: string,
  pageLimit?: number
): Promise<YoutubeComment[]> {
  const comments: YoutubeComment[] = [];
  let pageToken: string | undefined;
  let pages = 0;
  const limit = pageLimit ?? Number(getEnv("YOUTUBE_COMMENTS_PAGE_LIMIT") ?? 0);

  do {
    const url = new URL(`${YOUTUBE_API_BASE}/commentThreads`);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("videoId", videoId);
    url.searchParams.set("maxResults", "100");
    url.searchParams.set("textFormat", "plainText");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`YouTube comments error ${res.status}: ${body}`);
    }
    const data = (await res.json()) as CommentThreadResponse;
    const items = data.items ?? [];
    for (const item of items) {
      const snippet = item.snippet;
      const topLevel = snippet?.topLevelComment;
      const topSnippet = topLevel?.snippet;
      const id = topLevel?.id;
      if (!id || !topSnippet) continue;
      const text =
        topSnippet.textOriginal ?? topSnippet.textDisplay ?? "";
      if (!text) continue;
      comments.push({
        id,
        videoId,
        text,
        authorName: topSnippet.authorDisplayName ?? "Unknown",
        authorChannelId: topSnippet.authorChannelId?.value ?? "",
        authorChannelUrl: topSnippet.authorChannelUrl ?? undefined,
        likeCount: topSnippet.likeCount ?? undefined,
        replyCount: snippet?.totalReplyCount ?? undefined,
        publishedAt: topSnippet.publishedAt ?? undefined,
        updatedAt: topSnippet.updatedAt ?? undefined,
      });
    }
    pageToken = data.nextPageToken;
    pages += 1;
    if (limit > 0 && pages >= limit) break;
  } while (pageToken);

  return comments;
}
