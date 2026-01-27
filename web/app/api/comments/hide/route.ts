import { NextResponse } from "next/server";
import { addHiddenCommentId, getCommentById, hasKvConfig, setComment } from "@/lib/kv";

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

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!hasKvConfig()) {
    return NextResponse.json({ ok: false, error: "KV not configured" }, { status: 500 });
  }

  const body = (await request.json()) as { commentId?: string };
  const commentId = body.commentId?.trim();
  if (!commentId) {
    return NextResponse.json({ ok: false, error: "commentId required" }, { status: 400 });
  }

  await addHiddenCommentId(commentId);
  const existing = await getCommentById(commentId);
  if (existing) {
    await setComment({
      ...existing,
      status: "hidden",
    });
  }

  return NextResponse.json({ ok: true });
}
