import { formatTimestamp } from "@/lib/time";
import type { TranscriptSegment } from "@/lib/data";

type Props = {
  segments: TranscriptSegment[];
  learnLookup?: Record<string, string>; // id -> term title (future)
};

export function Transcript({ segments }: Props) {
  if (segments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white/60 p-6 text-sm text-slate-600">
        字幕がまだ取得できていません。
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {segments.map((seg) => (
        <div
          key={seg.id}
          id={`t-${Math.floor(seg.start)}`}
          className="rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="mb-2 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <a
              href={`#t=${Math.floor(seg.start)}`}
              className="rounded-full bg-slate-100 px-2 py-1 font-mono text-slate-700 hover:bg-slate-200"
            >
              {formatTimestamp(seg.start)}
            </a>
            <span>Segment</span>
          </div>
          <p className="text-base leading-relaxed text-slate-900">{seg.text}</p>
        </div>
      ))}
    </div>
  );
}
