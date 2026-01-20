import { EpisodeCard } from "@/components/EpisodeCard";
import { episodes } from "@/lib/data";

export const metadata = { title: "Episodes – Singular Radio" };

export default function EpisodesPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Episodes
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          全エピソード一覧
        </h1>
        <p className="text-sm text-slate-600">
          公開順に並べています。検索・フィルタは今後追加。
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.slug} episode={episode} />
        ))}
      </div>
    </div>
  );
}
