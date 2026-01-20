import type { LearnTerm } from "@/lib/data";
import Link from "next/link";

export function LearnCard({ term }: { term: LearnTerm }) {
  return (
    <Link
      href={`/learn/${term.slug}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
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
                className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"
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
