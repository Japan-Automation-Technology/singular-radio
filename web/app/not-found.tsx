import Link from "next/link";

export default function NotFound() {
  return (
    <div className="glass-panel mx-auto max-w-lg space-y-3 rounded-2xl p-8 text-center ring-1 ring-sky-100/70">
      <p className="text-xs uppercase tracking-[0.2em] text-sky-600">404</p>
      <h1 className="text-3xl font-semibold text-slate-900">ページが見つかりません</h1>
      <p className="text-sm text-slate-600">URLをご確認ください。</p>
      <Link className="text-sm font-semibold text-sky-700 underline" href="/">
        Homeへ戻る
      </Link>
    </div>
  );
}
