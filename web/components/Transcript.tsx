import { formatTimestamp } from "@/lib/time";
import type { TranscriptSegment } from "@/lib/data";

type Props = {
  segments: TranscriptSegment[];
  learnLookup?: Record<string, string>; // id -> term title (future)
};

export function Transcript({ segments }: Props) {
  if (segments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-sky-200 bg-white/70 p-6 text-sm text-slate-600">
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
          className="glass-panel rounded-lg p-4 transition hover:-translate-y-0.5 hover:shadow-md ring-1 ring-sky-100/70"
        >
          <div className="mb-2 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <a
              href={`#t=${Math.floor(seg.start)}`}
              className="rounded-full border border-sky-100/80 bg-sky-50/80 px-2 py-1 font-mono text-sky-800 transition hover:bg-sky-100/80"
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
