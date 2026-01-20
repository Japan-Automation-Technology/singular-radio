import type { Episode } from "@/lib/data";
import Link from "next/link";

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <Link
      href={`/episodes/${episode.slug}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {episode.publishedAt}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-slate-700">
            {episode.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {episode.summary}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {episode.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs font-semibold text-slate-500">{episode.duration}</p>
      </div>
    </Link>
  );
}
