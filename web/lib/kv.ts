import type { Episode } from "@/lib/data";
import { Redis } from "@upstash/redis";
import type { TranscriptSegment } from "@/lib/data";
import type {
  CommentRecord,
  FeaturedComment,
  LeaderboardEntry,
} from "@/lib/comments";

function getEnv(name: string): string | null {
  return process.env[name] ?? null;
}

export function hasKvConfig(): boolean {
  return Boolean(
    getEnv("UPSTASH_REDIS_REST_URL") && getEnv("UPSTASH_REDIS_REST_TOKEN")
  );
}

function getEpisodesKey(): string {
  const playlist = getEnv("YOUTUBE_PLAYLIST_ID") ?? "default";
  return `episodes:${playlist}`;
}

function getTranscriptKey(videoId: string): string {
  return `transcript:${videoId}`;
}

function getCommentsNamespace(): string {
  const playlist = getEnv("YOUTUBE_PLAYLIST_ID") ?? "default";
  return `comments:${playlist}`;
}

function getCommentKey(commentId: string): string {
  return `${getCommentsNamespace()}:comment:${commentId}`;
}

function getVideoCommentsKey(videoId: string): string {
  return `${getCommentsNamespace()}:video:${videoId}:comments`;
}

function getAuthorCommentsKey(authorId: string): string {
  return `${getCommentsNamespace()}:author:${authorId}:comments`;
}

function getHiddenCommentsKey(): string {
  return `${getCommentsNamespace()}:hidden`;
}

function getFeaturedCommentsKey(): string {
  return `${getCommentsNamespace()}:featured`;
}

function getLeaderboardKey(): string {
  return `${getCommentsNamespace()}:leaderboard:weekly`;
}

function getTranscriptSummaryKey(videoId: string): string {
  return `${getCommentsNamespace()}:transcriptSummary:${videoId}`;
}

export async function getEpisodesFromKv(): Promise<Episode[] | null> {
  if (!hasKvConfig()) return null;
  const kv = Redis.fromEnv();
  const key = getEpisodesKey();
  const data = await kv.get<Episode[]>(key);
  return data ?? null;
}

export async function setEpisodesToKv(episodes: Episode[]): Promise<void> {
  if (!hasKvConfig()) return;
  const kv = Redis.fromEnv();
  const key = getEpisodesKey();
  await kv.set(key, episodes);
  await kv.set(`${key}:updatedAt`, new Date().toISOString());
}

export async function getEpisodesUpdatedAt(): Promise<string | null> {
  if (!hasKvConfig()) return null;
  const kv = Redis.fromEnv();
  const key = `${getEpisodesKey()}:updatedAt`;
  const data = await kv.get<string>(key);
  return data ?? null;
}

export async function getTranscriptFromKv(
  videoId: string
): Promise<TranscriptSegment[] | null> {
  if (!hasKvConfig()) return null;
  const kv = Redis.fromEnv();
  const key = getTranscriptKey(videoId);
  const data = await kv.get<TranscriptSegment[]>(key);
  return data ?? null;
}

export async function setTranscriptToKv(
  videoId: string,
  segments: TranscriptSegment[],
  ttlSeconds = 60 * 60 * 24
): Promise<void> {
  if (!hasKvConfig()) return;
  const kv = Redis.fromEnv();
  const key = getTranscriptKey(videoId);
  await kv.set(key, segments, { ex: ttlSeconds });
}

export async function isTranscriptBackoff(videoId: string): Promise<boolean> {
  if (!hasKvConfig()) return false;
  const kv = Redis.fromEnv();
  const key = `${getTranscriptKey(videoId)}:backoff`;
  const data = await kv.get<string>(key);
  return Boolean(data);
}

export async function setTranscriptBackoff(
  videoId: string,
  ttlSeconds = 60 * 10
): Promise<void> {
  if (!hasKvConfig()) return;
  const kv = Redis.fromEnv();
  const key = `${getTranscriptKey(videoId)}:backoff`;
  await kv.set(key, "1", { ex: ttlSeconds });
}

export async function getCommentById(
  commentId: string
): Promise<CommentRecord | null> {
  if (!hasKvConfig()) return null;
  const kv = Redis.fromEnv();
  const key = getCommentKey(commentId);
  const data = await kv.get<CommentRecord>(key);
  return data ?? null;
}

export async function setComment(comment: CommentRecord): Promise<void> {
  if (!hasKvConfig()) return;
  const kv = Redis.fromEnv();
  const key = getCommentKey(comment.id);
  await kv.set(key, comment);
}

export async function getVideoCommentIds(videoId: string): Promise<string[]> {
  if (!hasKvConfig()) return [];
  const kv = Redis.fromEnv();
  const key = getVideoCommentsKey(videoId);
  const data = await kv.smembers<string>(key);
  return data ?? [];
}

export async function replaceVideoCommentIds(
  videoId: string,
  ids: string[]
): Promise<void> {
  if (!hasKvConfig()) return;
  const kv = Redis.fromEnv();
  const key = getVideoCommentsKey(videoId);
  await kv.del(key);
  if (ids.length > 0) {
    await kv.sadd(key, ...ids);
  }
}

export async function addAuthorCommentId(
  authorId: string,
  commentId: string
): Promise<void> {
  if (!hasKvConfig()) return;
  if (!authorId) return;
  const kv = Redis.fromEnv();
  const key = getAuthorCommentsKey(authorId);
  await kv.sadd(key, commentId);
}

export async function getHiddenCommentIds(): Promise<Set<string>> {
  if (!hasKvConfig()) return new Set();
  const kv = Redis.fromEnv();
  const key = getHiddenCommentsKey();
  const data = await kv.smembers<string>(key);
  return new Set(data ?? []);
}

export async function addHiddenCommentId(commentId: string): Promise<void> {
  if (!hasKvConfig()) return;
  const kv = Redis.fromEnv();
  const key = getHiddenCommentsKey();
  await kv.sadd(key, commentId);
}

export async function getFeaturedCommentsFromKv(): Promise<
  FeaturedComment[] | null
> {
  if (!hasKvConfig()) return null;
  const kv = Redis.fromEnv();
  const key = getFeaturedCommentsKey();
  const data = await kv.get<FeaturedComment[]>(key);
  return data ?? null;
}

export async function setFeaturedCommentsToKv(
  comments: FeaturedComment[]
): Promise<void> {
  if (!hasKvConfig()) return;
  const kv = Redis.fromEnv();
  const key = getFeaturedCommentsKey();
  await kv.set(key, comments);
  await kv.set(`${key}:updatedAt`, new Date().toISOString());
}

export async function getFeaturedCommentsUpdatedAt(): Promise<string | null> {
  if (!hasKvConfig()) return null;
  const kv = Redis.fromEnv();
  const key = `${getFeaturedCommentsKey()}:updatedAt`;
  const data = await kv.get<string>(key);
  return data ?? null;
}

export async function getLeaderboardFromKv(): Promise<LeaderboardEntry[] | null> {
  if (!hasKvConfig()) return null;
  const kv = Redis.fromEnv();
  const key = getLeaderboardKey();
  const data = await kv.get<LeaderboardEntry[]>(key);
  return data ?? null;
}

export async function setLeaderboardToKv(
  entries: LeaderboardEntry[]
): Promise<void> {
  if (!hasKvConfig()) return;
  const kv = Redis.fromEnv();
  const key = getLeaderboardKey();
  await kv.set(key, entries);
  await kv.set(`${key}:updatedAt`, new Date().toISOString());
}

export async function getTranscriptSummaryFromKv(
  videoId: string
): Promise<string | null> {
  if (!hasKvConfig()) return null;
  const kv = Redis.fromEnv();
  const key = getTranscriptSummaryKey(videoId);
  const data = await kv.get<string>(key);
  return data ?? null;
}

export async function setTranscriptSummaryToKv(
  videoId: string,
  summary: string
): Promise<void> {
  if (!hasKvConfig()) return;
  const kv = Redis.fromEnv();
  const key = getTranscriptSummaryKey(videoId);
  await kv.set(key, summary);
}
