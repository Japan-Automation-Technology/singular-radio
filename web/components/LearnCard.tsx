import type { LearnTerm } from "@/lib/data";
import Link from "next/link";

export function LearnCard({ term }: { term: LearnTerm }) {
  return (
    <Link
      href={`/learn/${term.slug}`}
      className="glass-panel group block rounded-xl p-4 transition hover:-translate-y-1 hover:shadow-lg ring-1 ring-sky-100/70"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-600/80">
            Learn
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-slate-700">
            {term.title}
          </h3>
          <p className="mt-2 text-sm text-slate-600">{term.shortDef}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {term.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-sky-100/80 bg-sky-50/80 px-2 py-1 text-xs font-semibold text-sky-800"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs font-semibold text-slate-500">
          {term.occurrences.length} refs
        </p>
      </div>
    </Link>
  );
}
