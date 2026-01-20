import { LearnCard } from "@/components/LearnCard";
import { fetchLearnTerms } from "@/lib/cms";

export const metadata = { title: "Learn – Singular Radio" };

export default async function LearnPage() {
  const learnTerms = await fetchLearnTerms();
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Learn
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">用語と前提の復習</h1>
        <p className="text-sm text-slate-600">
          エピソードで積み上がる概念をまとめています。カテゴリや登場回で探せます（検索は後で追加）。
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {learnTerms.map((term) => (
          <LearnCard key={term.slug} term={term} />
        ))}
      </div>
    </div>
  );
}
