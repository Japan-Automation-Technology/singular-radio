import { FeaturedComments } from "@/components/FeaturedComments";
import { Leaderboard } from "@/components/Leaderboard";
import { fetchFeaturedComments, fetchLeaderboard } from "@/lib/community";

export const metadata = { title: "Community – Singular Radio" };
export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const featured = await fetchFeaturedComments();
  const leaderboard = await fetchLeaderboard();
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-600">
          Community
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          コメントのリーダーボード
        </h1>
        <p className="text-sm text-slate-600">
          コメントのスコアは週次で更新されます。Geminiによる多軸評価を採用しています。
        </p>
      </header>
      <FeaturedComments items={featured} />
      <Leaderboard
        entries={leaderboard}
        title="Comment Leaderboard"
        badge="Weekly"
        note="ランキングは週次で自動更新されます。"
      />
      <div className="glass-panel rounded-xl p-4 ring-1 ring-sky-100/70">
        <h3 className="text-sm font-semibold text-slate-900">投稿機能について</h3>
        <p className="mt-2 text-sm text-slate-700">
          次フェーズでSupabase Auth + RLSを使ったコメント投稿とモデレーションを追加予定です。
          それまではSNSのハッシュタグ #SingularRadio へのリンクを案内します。
        </p>
      </div>
    </div>
  );
}
