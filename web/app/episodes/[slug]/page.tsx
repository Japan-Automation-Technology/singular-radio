import { notFound } from "next/navigation";
import { Transcript } from "@/components/Transcript";
import { formatTimestamp } from "@/lib/time";
import { fetchEpisodeBySlug, fetchLearnTerms } from "@/lib/cms";
import { youtubeEmbedUrl } from "@/lib/youtube";

type Params = { slug: string };
type Props = { params: Params | Promise<Params> };

export default async function EpisodeDetail({ params }: Props) {
  const { slug } = await params;
  const episode = await fetchEpisodeBySlug(slug);
  if (!episode) return notFound();

  const allTerms = await fetchLearnTerms();
  const terms = allTerms.filter((t) => episode.learnTerms.includes(t.slug));

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Episode
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          {episode.title}
        </h1>
        <p className="text-sm text-slate-600">
          {episode.publishedAt} · {episode.duration} · {episode.guest}
        </p>
        <p className="max-w-3xl text-base text-slate-800">{episode.summary}</p>
        <div className="flex flex-wrap gap-2">
          {episode.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"
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
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm">
            {youtubeEmbedUrl(episode.youtubeUrl) ? (
              <iframe
                className="aspect-[16/10] w-full"
                src={youtubeEmbedUrl(episode.youtubeUrl)!}
                title={episode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="flex h-[320px] flex-col items-center justify-center gap-2 text-slate-200">
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

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Transcript</h2>
              <p className="text-xs text-slate-500">
                クリックでタイムスタンプにジャンプ
              </p>
            </div>
            <Transcript segments={episode.transcript} />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              この回に出る用語
            </h3>
            <div className="mt-3 space-y-2">
              {terms.map((term) => (
                <a
                  key={term.slug}
                  href={`/learn/${term.slug}`}
                  className="block rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                >
                  {term.title}
                </a>
              ))}
              {terms.length === 0 && (
                <p className="text-sm text-slate-600">
                  Tagged terms will appear here.
                </p>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Show Notes</h3>
            <ul className="mt-2 list-disc space-y-2 pl-4 text-sm text-slate-700">
              <li>タイムスタンプ付きの字幕を元に構成。</li>
              <li>動画ページの #t=timestamp でジャンプできます。</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Occurrences</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {episode.transcript.slice(0, 4).map((seg) => (
                <li key={seg.id} className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                    {formatTimestamp(seg.start)}
                  </span>
                  <span className="line-clamp-1">{seg.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
