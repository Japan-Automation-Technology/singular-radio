import type { FeaturedComment, LeaderboardEntry } from "@/lib/comments";

export type TranscriptSegment = {
  id: string;
  text: string;
  start: number; // seconds
  end: number;
};

export type Episode = {
  slug: string;
  title: string;
  guest?: string;
  publishedAt: string;
  duration: string;
  thumbnailUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  tags: string[];
  summary: string;
  transcript: TranscriptSegment[];
  learnTerms: string[]; // slugs
};

export type LearnTerm = {
  slug: string;
  title: string;
  shortDef: string;
  longDef: string;
  categories: string[];
  occurrences: Array<{ episode: string; timestamp: number }>;
};

export const learnTerms: LearnTerm[] = [
  {
    slug: "agi",
    title: "AGI (汎用人工知能)",
    shortDef: "人間と同等以上の汎用認知能力を持つ人工知能。",
    longDef:
      "特定タスクに限定されない広範な認知能力を持ち、自己改善や転移学習が可能な人工知能の仮説的到達点。安全性やガバナンスが主要な論点。",
    categories: ["AI", "Safety"],
    occurrences: [{ episode: "agi-2026-outlook", timestamp: 2 }],
  },
  {
    slug: "alignment",
    title: "アライメント問題",
    shortDef: "AIの目標・行動が人間の意図や価値観と一致するようにする課題。",
    longDef:
      "高度なAIが予期せぬ方向に自己最適化するリスクを抑え、人間の倫理や社会的価値と整合するように設計・運用する問題領域。",
    categories: ["AI", "Safety"],
    occurrences: [{ episode: "agi-2026-outlook", timestamp: 12 }],
  },
];

const transcriptSample: TranscriptSegment[] = [
  {
    id: "12d667ed-58ff-4ac2-a335-65d4f2087575",
    text: "さあ始まりましたシンギュラーラジオ",
    start: 0,
    end: 2.0867335,
  },
  {
    id: "f218e789-9da0-4c28-ba4b-8abefaa6c84b",
    text:
      "ということで今回は汎用知能を作るためにはどうすればいいかというまあAGIだねについて改めて2026年に考えていこうと思います",
    start: 2.0390574,
    end: 10.512,
  },
  {
    id: "9ffa6ab3-5c4b-4ad3-a6a8-cf08f5a9f3a3",
    text:
      "でそのこれからの進化、今年来年の進化を予想するにあたって現状のAIが持つ課題というのを認識するのがまずめちゃくちゃ大事だろうということで",
    start: 11.612,
    end: 21.6119999,
  },
  {
    id: "ce877a4c-9811-467b-8689-55e2dda66b34",
    text:
      "そこで参考になるのが2025年末にイリヤ・サツケバーというオープンAIの共同創業者",
    start: 21.6556298,
    end: 27.9564903,
  },
];

export const episodes: Episode[] = [
  {
    slug: "agi-2026-outlook",
    title: "2026年版・AGIへの現実的ロードマップを考える",
    guest: "Solo回",
    publishedAt: "2026-01-10",
    duration: "42:18",
    thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    spotifyUrl:
      "https://open.spotify.com/show/2nOYrpc9PhKQ5v7s81KzCW?si=demo",
    appleUrl: "https://podcasts.apple.com/us/podcast/id1809437976",
    tags: ["AGI", "Alignment", "Forecast"],
    summary:
      "2026年時点でのAGI開発の論点を整理し、技術・安全・社会実装の観点からロードマップを議論します。",
    transcript: transcriptSample,
    learnTerms: ["agi", "alignment"],
  },
];

export const leaderboard: LeaderboardEntry[] = [
  {
    user: "kai",
    text: "タイムスタンプ付きのLearnリンクが最高。復習が捗った。",
    score: 42,
  },
  {
    user: "sara",
    text: "イリヤ発言の補足リサーチ助かりました。",
    score: 31,
  },
  {
    user: "moto",
    text: "用語集ではなく“Learn”という切り口が好き。",
    score: 27,
  },
];

export const featuredComments: FeaturedComment[] = [
  {
    id: "demo-1",
    videoId: "agi-2026-outlook",
    authorName: "yuna",
    text: "AGIの進化速度について具体例があって分かりやすかった。次回は安全性の実装面も深掘りしてほしい。",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&lc=demo-1",
    score: 92,
    rationale: "具体的な言及と建設的な提案がある。",
  },
  {
    id: "demo-2",
    videoId: "agi-2026-outlook",
    authorName: "hiro",
    text: "2026年のロードマップは社会実装の話まで触れていて新鮮。特に規制の話はもっと聞きたい。",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&lc=demo-2",
    score: 88,
    rationale: "独自の視点と具体性が高い。",
  },
];
