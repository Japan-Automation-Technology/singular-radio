type Entry = { user: string; text: string; score: number };

export function Leaderboard({ entries }: { entries: Entry[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Community
          </p>
          <h2 className="text-xl font-semibold text-slate-900">
            Leaderboard (demo)
          </h2>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          Weekly
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {entries.map((entry, i) => (
          <div
            key={entry.user}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
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
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
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
