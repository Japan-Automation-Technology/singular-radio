import type { Episode } from "@/lib/data";
import { Redis } from "@upstash/redis";

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
