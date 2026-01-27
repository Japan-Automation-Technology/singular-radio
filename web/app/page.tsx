import { EpisodeHero } from "@/components/EpisodeHero";
import { EpisodeCard } from "@/components/EpisodeCard";
import { Leaderboard } from "@/components/Leaderboard";
import { leaderboard } from "@/lib/data";
import Link from "next/link";
import { fetchEpisodes } from "@/lib/cms";

// Always render this page on each request so new episodes appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function Home() {
  const episodes = await fetchEpisodes();
  const latest = episodes[0];
  const featuredEpisodes = episodes.slice(0, 6);
  if (!latest) {
    return <p>まだエピソードがありません。</p>;
  }
  return (
    <div className="space-y-10">
      <EpisodeHero episode={latest} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Episodes
          </h2>
          <Link className="text-sm text-sky-700 underline" href="/episodes">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {featuredEpisodes.map((ep) => (
            <EpisodeCard key={ep.slug} episode={ep} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Leaderboard entries={leaderboard} />
      </section>
    </div>
  );
}
