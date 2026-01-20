import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="text-3xl font-semibold text-slate-900">ページが見つかりません</h1>
      <p className="text-sm text-slate-600">URLをご確認ください。</p>
      <Link className="text-sm font-semibold text-slate-800 underline" href="/">
        Homeへ戻る
      </Link>
    </div>
  );
}
