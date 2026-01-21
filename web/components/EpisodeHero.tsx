import type { Episode } from "@/lib/data";
import Link from "next/link";

export function EpisodeHero({ episode }: { episode: Episode }) {
  const embedUrl = youtubeEmbedUrl(episode.youtubeUrl);
  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Latest Episode
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-slate-900">
            {episode.title}
          </h1>
          <p className="text-sm text-slate-600">
            {episode.publishedAt} · {episode.duration} · {episode.guest}
          </p>
          <p className="max-w-2xl text-base text-slate-800">{episode.summary}</p>
          <div className="flex flex-wrap gap-2">
            {episode.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {episode.youtubeUrl && (
              <a
                href={episode.youtubeUrl}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Watch on YouTube
              </a>
            )}
            {episode.spotifyUrl && (
              <a
                href={episode.spotifyUrl}
                className="rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-900 hover:text-white"
              >
                Listen on Spotify
              </a>
            )}
            {episode.appleUrl && (
              <a
                href={episode.appleUrl}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-900"
              >
                Apple Podcast
              </a>
            )}
          </div>
        </div>
        <div className="w-full md:w-[520px]">
          <div className="aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-black">
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
        <Link className="text-slate-700 underline" href={`/episodes/${episode.slug}`}>
          Go to episode page →
        </Link>
      </div>
    </section>
  );
}
import { youtubeEmbedUrl } from "@/lib/youtube";
