import { NextResponse } from "next/server";
import { fetchYoutubeEpisodes, hasYoutubeConfig } from "@/lib/youtube-data";
import { hasKvConfig, setEpisodesToKv } from "@/lib/kv";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");
  if (querySecret && querySecret === secret) return true;
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7) === secret;
  }
  const headerSecret = request.headers.get("x-cron-secret");
  return headerSecret === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!hasKvConfig()) {
    return NextResponse.json({ ok: false, error: "KV not configured" }, { status: 500 });
  }
  if (!hasYoutubeConfig()) {
    return NextResponse.json({ ok: false, error: "YouTube not configured" }, { status: 500 });
  }

  const episodes = await fetchYoutubeEpisodes();
  await setEpisodesToKv(episodes);
  return NextResponse.json({ ok: true, count: episodes.length });
}
