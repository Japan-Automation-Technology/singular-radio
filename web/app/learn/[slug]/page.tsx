import { notFound } from "next/navigation";
import { formatTimestamp } from "@/lib/time";
import { fetchLearnBySlug, fetchEpisodes } from "@/lib/cms";

type Params = { slug: string };
type Props = { params: Params | Promise<Params> };

export default async function LearnDetail({ params }: Props) {
  const { slug } = await params;
  const term = await fetchLearnBySlug(slug);
  if (!term) return notFound();
  const episodes = await fetchEpisodes();

  return (
    <div className="space-y-8">
      <header className="glass-panel space-y-3 rounded-2xl p-6 ring-1 ring-sky-100/70">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-600">Learn</p>
        <h1 className="text-3xl font-semibold text-slate-900">{term.title}</h1>
        <p className="text-sm text-slate-600">{term.shortDef}</p>
        <div className="flex flex-wrap gap-2">
          {term.categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-sky-100/80 bg-sky-50/80 px-2 py-1 text-xs font-semibold text-sky-800"
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
                className="glass-panel flex items-center justify-between rounded-xl p-4 transition hover:-translate-y-0.5 hover:shadow-md ring-1 ring-sky-100/70"
                href={`/episodes/${ep.slug}#t=${Math.floor(occ.timestamp)}`}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{ep.title}</p>
                  <p className="text-xs text-slate-600">{ep.publishedAt}</p>
                </div>
                <span className="rounded-full border border-sky-100/80 bg-sky-50/80 px-3 py-1 font-mono text-xs text-sky-800">
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
