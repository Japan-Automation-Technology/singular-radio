import { notFound } from "next/navigation";
import { learnTerms, episodes } from "@/lib/data";
import { formatTimestamp } from "@/lib/time";

type Props = { params: { slug: string } };

export default function LearnDetail({ params }: Props) {
  const term = learnTerms.find((t) => t.slug === params.slug);
  if (!term) return notFound();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Learn</p>
        <h1 className="text-3xl font-semibold text-slate-900">{term.title}</h1>
        <p className="text-sm text-slate-600">{term.shortDef}</p>
        <div className="flex flex-wrap gap-2">
          {term.categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"
            >
              {cat}
            </span>
          ))}
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">詳細</h2>
        <p className="text-base leading-relaxed text-slate-800">{term.longDef}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">登場したエピソード</h2>
        <div className="space-y-3">
          {term.occurrences.map((occ) => {
            const ep = episodes.find((e) => e.slug === occ.episode);
            if (!ep) return null;
            return (
              <a
                key={`${occ.episode}-${occ.timestamp}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                href={`/episodes/${ep.slug}#t=${Math.floor(occ.timestamp)}`}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{ep.title}</p>
                  <p className="text-xs text-slate-600">{ep.publishedAt}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-slate-700">
                  {formatTimestamp(occ.timestamp)}
                </span>
              </a>
            );
          })}
          {term.occurrences.length === 0 && (
            <p className="text-sm text-slate-600">紐づいたエピソードはまだありません。</p>
          )}
        </div>
      </section>
    </div>
  );
}
