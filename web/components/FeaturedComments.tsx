import Link from "next/link";
import type { FeaturedComment } from "@/lib/comments";

export function FeaturedComments({
  items,
}: {
  items: FeaturedComment[];
}) {
  return (
    <div className="glass-panel rounded-2xl p-6 ring-1 ring-sky-100/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-600">
            Community
          </p>
          <h2 className="text-xl font-semibold text-slate-900">
            Featured Comments
          </h2>
        </div>
        <span className="rounded-full bg-gradient-to-r from-sky-600 to-teal-500 px-3 py-1 text-xs font-semibold text-white">
          Daily
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-sky-100/80 bg-white/90 p-4 text-sm text-slate-500">
            まだフィーチャー対象のコメントがありません。
          </div>
        ) : null}
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-sky-100/80 bg-white/90 p-4 shadow-sm"
          >
            <p className="text-sm text-slate-700">{item.text}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{item.authorName}</span>
              <Link
                className="text-sky-700 underline"
                href={item.youtubeUrl}
                target="_blank"
                rel="noreferrer"
              >
                YouTubeで見る
              </Link>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Geminiが安全性・独自性・具体性を中心に選定しています。
      </p>
    </div>
  );
}
