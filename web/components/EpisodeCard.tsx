import type { Episode } from "@/lib/data";
import Link from "next/link";

export function EpisodeCard({ episode }: { episode: Episode }) {
  const meta = [episode.publishedAt, episode.duration].filter(Boolean).join(" · ");
  const hasSummary = Boolean(episode.summary);
  const hasTags = episode.tags.length > 0;
  const card = (
    <div className="flex items-center gap-4">
      <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        {episode.thumbnailUrl ? (
          <img
            src={episode.thumbnailUrl}
            alt={episode.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            No Image
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        {meta && (
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {meta}
          </p>
        )}
        <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-slate-700">
          {episode.title}
        </h3>
        {hasSummary && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {episode.summary}
          </p>
        )}
        {hasTags && (
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
        )}
      </div>
    </div>
  );

  if (episode.externalUrl) {
    return (
      <a
        href={episode.externalUrl}
        className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        {card}
      </a>
    );
  }

  return (
    <Link
      href={`/episodes/${episode.slug}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      {card}
    </Link>
  );
}
