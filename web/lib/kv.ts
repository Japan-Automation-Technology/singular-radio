import type { Episode } from "@/lib/data";
import { Redis } from "@upstash/redis";
import type { TranscriptSegment } from "@/lib/data";

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
