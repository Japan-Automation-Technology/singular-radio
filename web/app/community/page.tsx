import { Leaderboard } from "@/components/Leaderboard";
import { leaderboard } from "@/lib/data";

export const metadata = { title: "Community – Singular Radio" };

export default function CommunityPage() {
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
          本番では週次/通算スコアを自動集計。MVPではデモデータを表示しています。
        </p>
      </header>
      <Leaderboard entries={leaderboard} />
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
