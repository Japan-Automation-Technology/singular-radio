import { featuredComments as mockFeatured, leaderboard as mockLeaderboard } from "@/lib/data";
import {
  getFeaturedCommentsFromKv,
  getLeaderboardFromKv,
  hasKvConfig,
} from "@/lib/kv";
import type { FeaturedComment, LeaderboardEntry } from "@/lib/comments";

export async function fetchFeaturedComments(): Promise<FeaturedComment[]> {
  if (hasKvConfig()) {
    const cached = await getFeaturedCommentsFromKv();
    if (cached && cached.length > 0) return cached;
  }
  return mockFeatured;
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (hasKvConfig()) {
    const cached = await getLeaderboardFromKv();
    if (cached && cached.length > 0) return cached;
  }
  return mockLeaderboard;
}
