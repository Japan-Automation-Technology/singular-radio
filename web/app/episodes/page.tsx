import { EpisodeCard } from "@/components/EpisodeCard";
import { fetchEpisodes } from "@/lib/cms";

export const metadata = { title: "Episodes – Singular Radio" };

// Force dynamic rendering so the list reflects newly published episodes immediately.
export const dynamic = "force-dynamic";

export default async function EpisodesPage() {
  const episodes = await fetchEpisodes();
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-600">
          Episodes
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          全エピソード一覧
        </h1>
        <p className="text-sm text-slate-600">
          公開順に並べています。検索・フィルタは今後追加。
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.slug} episode={episode} />
        ))}
      </div>
    </div>
  );
}
