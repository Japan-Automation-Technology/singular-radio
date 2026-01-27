import type { Episode } from "@/lib/data";
import { youtubeEmbedUrl } from "@/lib/youtube";
import Link from "next/link";

export function EpisodeHero({ episode }: { episode: Episode }) {
  const embedUrl = youtubeEmbedUrl(episode.youtubeUrl);
  const meta = [episode.publishedAt, episode.duration, episode.guest]
    .filter(Boolean)
    .join(" · ");
  const hasTags = episode.tags.length > 0;
  return (
    <section className="glass-panel animate-rise rounded-2xl p-6 ring-1 ring-sky-100/70">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-600">
            Latest Episode
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-slate-900">
            {episode.title}
          </h1>
          {meta && <p className="text-sm text-slate-600">{meta}</p>}
          {hasTags && (
            <div className="flex flex-wrap gap-2">
              {episode.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-sky-100/80 bg-sky-50/80 px-3 py-1 text-xs font-semibold text-sky-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {episode.youtubeUrl && (
              <a
                href={episode.youtubeUrl}
                className="rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
              >
                Watch on YouTube
              </a>
            )}
            {episode.spotifyUrl && (
              <a
                href={episode.spotifyUrl}
                className="rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:text-sky-900"
              >
                Listen on Spotify
              </a>
            )}
            {episode.appleUrl && (
              <a
                href={episode.appleUrl}
                className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
              >
                Apple Podcast
              </a>
            )}
          </div>
        </div>
        <div className="w-full md:w-[520px]">
          <div className="aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm">
            {embedUrl ? (
              <iframe
                className="h-full w-full"
                src={embedUrl}
                title={episode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 bg-slate-950 text-slate-200">
                <p className="text-sm">埋め込みできません</p>
                {episode.youtubeUrl && (
                  <a
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900"
                    href={episode.youtubeUrl}
                  >
                    YouTubeで開く
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 text-right text-sm">
        <Link
          className="text-sky-700 underline"
          href={`/episodes/${episode.slug}`}
        >
          Go to episode page →
        </Link>
      </div>
    </section>
  );
}
