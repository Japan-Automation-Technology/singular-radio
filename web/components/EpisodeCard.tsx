import type { Episode } from "@/lib/data";
import Link from "next/link";

const formatCount = (value?: number) => {
  if (value === undefined || value === null) return "";
  return new Intl.NumberFormat("ja-JP").format(value);
};

export function EpisodeCard({ episode }: { episode: Episode }) {
  const meta = [episode.publishedAt, episode.duration].filter(Boolean).join(" · ");
  const hasTags = episode.tags.length > 0;
  const viewCount = formatCount(episode.viewCount);
  const likeCount = formatCount(episode.likeCount);
  const commentCount = formatCount(episode.commentCount);
  const card = (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 md:w-72">
        {episode.thumbnailUrl ? (
          <img
            src={episode.thumbnailUrl}
            alt={episode.title}
            className="h-full w-full object-contain"
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
        {(viewCount || likeCount || commentCount) && (
          <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
            {viewCount && (
              <span className="inline-flex items-center gap-1.5">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 text-slate-500"
                >
                  <path
                    fill="currentColor"
                    d="M12 5c-5 0-9 4.1-10 7 1 2.9 5 7 10 7s9-4.1 10-7c-1-2.9-5-7-10-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                  />
                </svg>
                再生 {viewCount}
              </span>
            )}
            {likeCount && (
              <span className="inline-flex items-center gap-1.5">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 text-slate-500"
                >
                  <path
                    fill="currentColor"
                    d="M7 10V21H3V10h4Zm2 11h7.4a3 3 0 0 0 2.9-2.2l1.6-6.4A2.5 2.5 0 0 0 18.4 9H13l.8-3.7.1-.7a1 1 0 0 0-.3-.7L12.4 3 7.6 7.8A3 3 0 0 0 7 10v11Z"
                  />
                </svg>
                高評価 {likeCount}
              </span>
            )}
            {commentCount && (
              <span className="inline-flex items-center gap-1.5">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 text-slate-500"
                >
                  <path
                    fill="currentColor"
                    d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v9h2v2.2L8.4 15H20V6H4Z"
                  />
                </svg>
                コメント {commentCount}
              </span>
            )}
          </div>
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

  return (
    <Link
      href={`/episodes/${episode.slug}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      {card}
    </Link>
  );
}
