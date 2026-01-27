import { createHash } from "crypto";

export type CommentStatus = "active" | "deleted" | "hidden";

export type CommentSafety = {
  ok: boolean;
  labels: string[];
  confidence: number;
};

export type CommentScores = {
  overall: number;
  safety: number;
  originality: number;
  specificity: number;
  constructive: number;
  community: number;
};

export type CommentRecord = {
  id: string;
  videoId: string;
  authorChannelId: string;
  authorName: string;
  authorUrl?: string;
  text: string;
  publishedAt?: string;
  updatedAt?: string;
  likeCount?: number;
  replyCount?: number;
  fingerprint: string;
  status: CommentStatus;
  safety?: CommentSafety;
  scores?: CommentScores;
  feature?: boolean;
  rationale?: string;
  scoredAt?: string;
  modelVersion?: string;
};

export type FeaturedComment = {
  id: string;
  videoId: string;
  authorName: string;
  text: string;
  youtubeUrl: string;
  score?: number;
  rationale?: string;
};

export type LeaderboardEntry = {
  user: string;
  text: string;
  score: number;
};

export function normalizeCommentText(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

export function commentFingerprint(text: string): string {
  const normalized = normalizeCommentText(text);
  return createHash("sha256").update(normalized).digest("hex");
}

export function buildCommentUrl(videoId: string, commentId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}&lc=${commentId}`;
}

export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
