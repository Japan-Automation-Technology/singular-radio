import { NextResponse } from "next/server";
import { getEpisodesFromKv, getEpisodesUpdatedAt, hasKvConfig } from "@/lib/kv";
import { fetchYoutubeEpisodes, hasYoutubeConfig } from "@/lib/youtube-data";

export async function GET() {
  if (hasKvConfig()) {
    const episodes = await getEpisodesFromKv();
    const updatedAt = await getEpisodesUpdatedAt();
    if (episodes) {
      return NextResponse.json({ episodes, updatedAt });
    }
  }

  if (hasYoutubeConfig()) {
    const episodes = await fetchYoutubeEpisodes();
    return NextResponse.json({ episodes, updatedAt: null });
  }

  return NextResponse.json({ episodes: [], updatedAt: null }, { status: 200 });
}
