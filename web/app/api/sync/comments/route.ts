import { NextResponse } from "next/server";
import { fetchYoutubeEpisodes, fetchYoutubeTranscriptById, hasYoutubeConfig } from "@/lib/youtube-data";
import { fetchYoutubeCommentsForVideo, getYoutubeApiKey } from "@/lib/youtube-comments";
import {
  addAuthorCommentId,
  getCommentById,
  getHiddenCommentIds,
  getTranscriptSummaryFromKv,
  isTranscriptSummaryBackoff,
  getVideoCommentIds,
  hasKvConfig,
  replaceVideoCommentIds,
  setComment,
  setFeaturedCommentsToKv,
  setLeaderboardToKv,
  setTranscriptSummaryBackoff,
  setTranscriptSummaryToKv,
} from "@/lib/kv";
import {
  buildCommentUrl,
  commentFingerprint,
  type CommentRecord,
  type FeaturedComment,
  type LeaderboardEntry,
} from "@/lib/comments";
import {
  getGeminiModel,
  hasGeminiConfig,
  scoreCommentWithGemini,
  summarizeTranscriptWithGemini,
} from "@/lib/gemini";

const FEATURED_LIMIT = Number(process.env.FEATURED_COMMENTS_LIMIT ?? 12);
const FEATURED_MAX_PER_VIDEO = Number(process.env.FEATURED_MAX_PER_VIDEO ?? 2);
const FEATURED_MAX_PER_AUTHOR = Number(process.env.FEATURED_MAX_PER_AUTHOR ?? 1);
const LEADERBOARD_LIMIT = Number(process.env.LEADERBOARD_LIMIT ?? 10);
const LEADERBOARD_TOP_K = Number(process.env.LEADERBOARD_TOP_K ?? 10);
const TRANSCRIPT_MAX_CHARS = Number(process.env.TRANSCRIPT_SUMMARY_CHARS ?? 5000);

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

function isHardBlocked(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.length < 3) return "too_short";
  if (/^https?:\/\//i.test(trimmed) && trimmed.length < 80) return "link_only";
  if (/^[@#]?\w{1,2}$/.test(trimmed)) return "too_short";
  return null;
}

function truncateTranscript(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}...`;
}

async function ensureTranscriptSummary(params: {
  videoId: string;
  title: string;
  fallbackSummary: string;
}): Promise<string> {
  const cached = await getTranscriptSummaryFromKv(params.videoId);
  if (cached) return cached;
  const backoff = await isTranscriptSummaryBackoff(params.videoId);
  if (backoff) return params.fallbackSummary;
  if (!hasGeminiConfig()) return params.fallbackSummary;

  try {
    const segments = await fetchYoutubeTranscriptById(params.videoId);
    if (!segments || segments.length === 0) {
      await setTranscriptSummaryBackoff(params.videoId, 60 * 60 * 24);
      return params.fallbackSummary;
    }
    const transcriptText = segments.map((seg) => seg.text).join(" ");
    const excerpt = truncateTranscript(transcriptText, TRANSCRIPT_MAX_CHARS);
    const result = await summarizeTranscriptWithGemini({
      title: params.title,
      transcript: excerpt,
    });
    if (result.summary) {
      await setTranscriptSummaryToKv(params.videoId, result.summary);
      return result.summary;
    }
  } catch (err) {
    console.error("transcript summary error", err);
    await setTranscriptSummaryBackoff(params.videoId, 60 * 60 * 6);
  }
  return params.fallbackSummary;
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
  if (!hasGeminiConfig()) {
    return NextResponse.json({ ok: false, error: "Gemini not configured" }, { status: 500 });
  }

  const apiKey = getYoutubeApiKey();
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "YouTube API key missing" }, { status: 500 });
  }

  const episodes = await fetchYoutubeEpisodes();
  const hiddenIds = await getHiddenCommentIds();
  const modelVersion = getGeminiModel();
  const featuredCandidates: CommentRecord[] = [];
  const activeComments: CommentRecord[] = [];
  let totalFetched = 0;
  let totalScored = 0;

  for (const episode of episodes) {
    const videoId = episode.slug;
    try {
      const existingIds = await getVideoCommentIds(videoId);
      const incomingComments = await fetchYoutubeCommentsForVideo(videoId, apiKey);
      totalFetched += incomingComments.length;

      const incomingIds: string[] = [];
      const transcriptSummary = await ensureTranscriptSummary({
        videoId,
        title: episode.title,
        fallbackSummary: episode.summary || episode.title,
      });

      for (const comment of incomingComments) {
        incomingIds.push(comment.id);
        const fingerprint = commentFingerprint(comment.text);
        const existing = await getCommentById(comment.id);
        const status = hiddenIds.has(comment.id) ? "hidden" : "active";

        const record: CommentRecord = {
          id: comment.id,
          videoId,
          authorChannelId: comment.authorChannelId,
          authorName: comment.authorName,
          authorUrl: comment.authorChannelUrl,
          text: comment.text,
          publishedAt: comment.publishedAt,
          updatedAt: comment.updatedAt,
          likeCount: comment.likeCount,
          replyCount: comment.replyCount,
          fingerprint,
          status,
          safety: existing?.safety,
          scores: existing?.scores,
          feature: existing?.feature,
          rationale: existing?.rationale,
          scoredAt: existing?.scoredAt,
          modelVersion: existing?.modelVersion,
        };

        if (status === "active") {
          const needsScoring =
            !existing ||
            existing.fingerprint !== fingerprint ||
            !existing.scores ||
            !existing.safety;
          if (needsScoring) {
            const blockReason = isHardBlocked(comment.text);
            if (blockReason) {
              record.safety = { ok: false, labels: [blockReason], confidence: 1 };
              record.scores = {
                overall: 0,
                safety: 0,
                originality: 0,
                specificity: 0,
                constructive: 0,
                community: 0,
              };
              record.feature = false;
              record.rationale = blockReason;
              record.scoredAt = new Date().toISOString();
              record.modelVersion = modelVersion;
            } else {
              const result = await scoreCommentWithGemini({
                comment: comment.text,
                videoTitle: episode.title,
                videoSummary: episode.summary || episode.title,
                transcriptSummary,
              });
              record.safety = result.safety;
              record.scores = result.scores;
              record.feature = result.feature && result.safety.ok;
              record.rationale = result.rationale;
              record.scoredAt = new Date().toISOString();
              record.modelVersion = modelVersion;
              totalScored += 1;
            }
          }
        }

        await setComment(record);
        await addAuthorCommentId(comment.authorChannelId, comment.id);
        activeComments.push(record);
        if (record.feature && record.safety?.ok && record.status === "active") {
          featuredCandidates.push(record);
        }
      }

      const removed = existingIds.filter((id) => !incomingIds.includes(id));
      for (const removedId of removed) {
        const existing = await getCommentById(removedId);
        if (existing && existing.status !== "hidden") {
          await setComment({
            ...existing,
            status: "deleted",
          });
        }
      }

      await replaceVideoCommentIds(videoId, incomingIds);
    } catch (err) {
      console.error("sync comments error", { videoId, err });
    }
  }

  const featured = buildFeaturedComments(featuredCandidates);
  await setFeaturedCommentsToKv(featured);

  const leaderboard = buildLeaderboard(activeComments);
  await setLeaderboardToKv(leaderboard);

  return NextResponse.json({
    ok: true,
    fetched: totalFetched,
    scored: totalScored,
    featured: featured.length,
    leaderboard: leaderboard.length,
  });
}

function buildFeaturedComments(candidates: CommentRecord[]): FeaturedComment[] {
  const byScore = [...candidates].sort((a, b) => {
    const scoreA = a.scores?.overall ?? 0;
    const scoreB = b.scores?.overall ?? 0;
    if (scoreA !== scoreB) return scoreB - scoreA;
    return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
  });

  const perVideo = new Map<string, number>();
  const perAuthor = new Map<string, number>();
  const featured: FeaturedComment[] = [];

  for (const comment of byScore) {
    if (featured.length >= FEATURED_LIMIT) break;
    const videoCount = perVideo.get(comment.videoId) ?? 0;
    if (videoCount >= FEATURED_MAX_PER_VIDEO) continue;
    const authorKey = comment.authorChannelId || comment.authorName;
    const authorCount = perAuthor.get(authorKey) ?? 0;
    if (authorCount >= FEATURED_MAX_PER_AUTHOR) continue;

    perVideo.set(comment.videoId, videoCount + 1);
    perAuthor.set(authorKey, authorCount + 1);
    featured.push({
      id: comment.id,
      videoId: comment.videoId,
      authorName: comment.authorName,
      text: comment.text,
      youtubeUrl: buildCommentUrl(comment.videoId, comment.id),
      score: comment.scores?.overall,
      rationale: comment.rationale,
    });
  }

  return featured;
}

function buildLeaderboard(comments: CommentRecord[]): LeaderboardEntry[] {
  const perAuthor = new Map<
    string,
    { name: string; scores: number[]; topText: string; topScore: number }
  >();

  for (const comment of comments) {
    if (comment.status !== "active") continue;
    if (!comment.safety?.ok) continue;
    const score = comment.scores?.overall;
    if (score === undefined) continue;
    const authorKey = comment.authorChannelId || comment.authorName;
    const entry = perAuthor.get(authorKey) ?? {
      name: comment.authorName,
      scores: [],
      topText: comment.text,
      topScore: score,
    };
    entry.scores.push(score);
    if (score >= entry.topScore) {
      entry.topScore = score;
      entry.topText = comment.text;
      entry.name = comment.authorName;
    }
    perAuthor.set(authorKey, entry);
  }

  const leaderboard = Array.from(perAuthor.values()).map((entry) => {
    const sorted = entry.scores.sort((a, b) => b - a).slice(0, LEADERBOARD_TOP_K);
    const avg =
      sorted.reduce((sum, value) => sum + value, 0) /
      (sorted.length || 1);
    return {
      user: entry.name,
      text: entry.topText,
      score: Math.round(avg),
    };
  });

  leaderboard.sort((a, b) => b.score - a.score);
  return leaderboard.slice(0, LEADERBOARD_LIMIT);
}
