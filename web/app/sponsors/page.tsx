export const metadata = { title: "Sponsors – Singular Radio" };

export default function SponsorsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Sponsors
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">スポンサー募集</h1>
        <p className="text-sm text-slate-600">
          テクノロジーと未来に関心の高いリスナーにリーチできます。媒体資料は簡易版を掲載しています。
        </p>
      </header>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">媒体情報</h2>
        <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-slate-700">
          <li>Spotify / Apple / YouTube クロス配信。</li>
          <li>長尺インタビュー中心。1本あたり平均 40–60 分。</li>
          <li>技術・政策・哲学に関心のあるリスナーが多い。</li>
        </ul>
        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-800">
          プレロール/ミドルロール/ポストロールの音声広告、動画提供、コミュニティ投稿など柔軟に設計します。
        </div>
        <a
          href="mailto:hello@singular.radio"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          スポンサー相談メールを送る
        </a>
      </div>
    </div>
  );
}
