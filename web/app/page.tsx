import { EpisodeHero } from "@/components/EpisodeHero";
import { EpisodeCard } from "@/components/EpisodeCard";
import { LearnCard } from "@/components/LearnCard";
import { Leaderboard } from "@/components/Leaderboard";
import { episodes, learnTerms, leaderboard } from "@/lib/data";
import Link from "next/link";

export default function Home() {
  const latest = episodes[0];
  const featuredLearn = learnTerms.slice(0, 3);
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
