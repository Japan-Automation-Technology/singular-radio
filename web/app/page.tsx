import { EpisodeHero } from "@/components/EpisodeHero";
import { EpisodeCard } from "@/components/EpisodeCard";
import { LearnCard } from "@/components/LearnCard";
import { Leaderboard } from "@/components/Leaderboard";
import { leaderboard } from "@/lib/data";
import Link from "next/link";
import { fetchEpisodes, fetchLearnTerms } from "@/lib/cms";

// Always render this page on each request so new episodes appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function Home() {
  const episodes = await fetchEpisodes();
  const learnTerms = await fetchLearnTerms();
  const latest = episodes[0];
  const featuredLearn = learnTerms.slice(0, 3);
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
          <Link className="text-sm text-slate-600 underline" href="/episodes">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {episodes.map((ep) => (
            <EpisodeCard key={ep.slug} episode={ep} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Learn</h2>
            <Link className="text-sm text-slate-600 underline" href="/learn">
              Browse all →
            </Link>
          </div>
          <div className="space-y-3">
            {featuredLearn.map((term) => (
              <LearnCard key={term.slug} term={term} />
            ))}
          </div>
        </div>

        <Leaderboard entries={leaderboard} />
      </section>
    </div>
  );
}
