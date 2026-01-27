type Entry = { user: string; text: string; score: number };

export function Leaderboard({ entries }: { entries: Entry[] }) {
  return (
    <div className="glass-panel rounded-2xl p-6 ring-1 ring-sky-100/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-600">
            Community
          </p>
          <h2 className="text-xl font-semibold text-slate-900">
            Leaderboard (demo)
          </h2>
        </div>
        <span className="rounded-full bg-gradient-to-r from-sky-600 to-teal-500 px-3 py-1 text-xs font-semibold text-white">
          Weekly
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {entries.map((entry, i) => (
          <div
            key={entry.user}
            className="rounded-xl border border-sky-100/80 bg-white/90 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">
                  #{i + 1}
                </span>
                <span className="text-base font-semibold text-slate-900">
                  {entry.user}
                </span>
              </div>
              <span className="rounded-full border border-sky-100/80 bg-sky-50/80 px-3 py-1 text-xs font-semibold text-sky-800">
                {entry.score} pts
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{entry.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        投稿機能は次のフェーズで追加予定。今はデモデータです。
      </p>
    </div>
  );
}
