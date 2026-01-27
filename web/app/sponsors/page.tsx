export const metadata = { title: "Sponsors – Singular Radio" };

export default function SponsorsPage() {
  return (
    <div className="space-y-12">
      <section className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 animate-rise">
          <p className="text-xs uppercase tracking-[0.4em] text-sky-600">
            Sponsors
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            スポンサー募集
          </h1>
          <p className="max-w-xl text-base text-slate-600">
            テクノロジーと未来に関心の高いリスナーへ、丁寧に価値を届ける設計です。
            露出ではなく信頼の積み上げを重視するブランドに向いています。
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:singularradio01@gmail.com"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
            >
              スポンサー相談メールを送る
            </a>
            <a
              href="#media-kit"
              className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-white/80 px-5 py-2 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:text-sky-900"
            >
              媒体資料を見る
            </a>
          </div>
        </div>
        <div className="glass-panel animate-rise-delayed rounded-2xl p-6 text-sm text-slate-700 ring-1 ring-sky-100/70">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-600">
              Summary
            </p>
            <span className="rounded-full bg-gradient-to-r from-sky-600 to-teal-500 px-3 py-1 text-xs font-semibold text-white">
              Simple + Premium
            </span>
          </div>
          <dl className="mt-4 space-y-4">
            <div className="space-y-1">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600/80">
                Distribution
              </dt>
              <dd className="text-base text-slate-900">
                Spotify / Apple / YouTube に同時展開
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600/80">
                Content
              </dt>
              <dd className="text-base text-slate-900">
                対話・インタビュー中心の長尺エピソード
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600/80">
                Audience
              </dt>
              <dd className="text-base text-slate-900">
                技術・政策・哲学に関心のあるリスナー
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="media-kit" className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600">
            Media Kit
          </p>
          <h2 className="text-2xl font-semibold text-slate-950 md:text-3xl">
            媒体情報
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">
            広告枠だけでなく、内容設計まで相談しながら進めるスタイルです。共同企画や長期連携も
            柔軟に検討できます。
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass-panel animate-rise rounded-2xl p-5 ring-1 ring-sky-100/70">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Distribution
            </h3>
            <p className="mt-2 text-base font-semibold text-slate-900">
              クロス配信で発見性を最大化
            </p>
            <p className="mt-3 text-sm text-slate-600">
              音声と動画の両方で届けるため、集中して聴きたい層にも視覚的に楽しみたい層にも届きます。
            </p>
          </div>
          <div className="glass-panel animate-rise rounded-2xl p-5 ring-1 ring-sky-100/70">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Audience
            </h3>
            <p className="mt-2 text-base font-semibold text-slate-900">
              深い理解と対話に価値を置く層
            </p>
            <p className="mt-3 text-sm text-slate-600">
              技術・政策・未来のテーマを丁寧に追いかける層へ、自然な文脈でブランドを届けます。
            </p>
          </div>
          <div className="glass-panel animate-rise rounded-2xl p-5 ring-1 ring-sky-100/70">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Brand Fit
            </h3>
            <p className="mt-2 text-base font-semibold text-slate-900">
              トーンと熱量を揃えた設計
            </p>
            <p className="mt-3 text-sm text-slate-600">
              ただの広告ではなく、価値を伝える会話として組み込むことを重視しています。
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200/70 border-t-sky-500/80 bg-white/90 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600">
            Formats
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            広告メニュー
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>
              プレロール / ミドルロール / ポストロール（1分前後の音声広告）
            </li>
            <li>番組内での読み上げ紹介（ホスト読み）</li>
            <li>提供クレジット表示・概要欄掲載・リンク導線</li>
          </ul>
          <div className="mt-5 rounded-xl border border-sky-100/70 bg-sky-50/70 p-4 text-sm text-slate-700">
            配信頻度・露出量は相談の上で最適化します。単発でも長期でも対応可能です。
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-6 ring-1 ring-teal-100/70">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-600">
            Process
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            進め方
          </h3>
          <ol className="mt-4 space-y-4 text-sm text-slate-700">
            <li>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Step 01
              </span>
              <p className="mt-1 text-base text-slate-900">
                目的とターゲットを共有
              </p>
              <p className="mt-1 text-sm text-slate-600">
                伝えたい価値・届けたい層をすり合わせます。
              </p>
            </li>
            <li>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Step 02
              </span>
              <p className="mt-1 text-base text-slate-900">
                企画と露出設計
              </p>
              <p className="mt-1 text-sm text-slate-600">
                露出ではなく文脈重視で設計し、番組のトーンに合わせます。
              </p>
            </li>
            <li>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Step 03
              </span>
              <p className="mt-1 text-base text-slate-900">
                制作・配信・レポート
              </p>
              <p className="mt-1 text-sm text-slate-600">
                配信後の反響や改善点も共有し、継続的に磨き上げます。
              </p>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
