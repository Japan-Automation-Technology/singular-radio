export const metadata = { title: "About – Singular Radio" };

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-600">
          About
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Singular Radioとは</h1>
        <p className="text-sm text-slate-600">
          専門家が本気で考えるテクノロジーと未来の議論を、水準を下げずに社会へ開く思考型メディア。
        </p>
      </header>
      <div className="space-y-4">
        <div className="glass-panel rounded-xl p-6 ring-1 ring-sky-100/70">
          <h2 className="text-xl font-semibold text-slate-900">Mission</h2>
          <p className="mt-2 text-base text-slate-800">
            AIやシンギュラリティを入口に、世界がどこへ向かうのか、私たちは何を前提として考え直すべきかを問い直します。
          </p>
        </div>
        <div className="glass-panel rounded-xl p-6 ring-1 ring-sky-100/70">
          <h2 className="text-xl font-semibold text-slate-900">Links</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            <li>
              <a className="text-sky-700 underline" href="https://www.youtube.com/@SingularRadio">
                YouTube
              </a>
            </li>
            <li>
              <a className="text-sky-700 underline" href="https://podcasts.apple.com/us/podcast/id1809437976">
                Apple Podcast
              </a>
            </li>
            <li>
              <a className="text-sky-700 underline" href="https://open.spotify.com/show/2nOYrpc9PhKQ5v7s81KzCW">
                Spotify
              </a>
            </li>
            <li>
              <a className="text-sky-700 underline" href="https://x.com/SingularRadio">
                X (Twitter)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
