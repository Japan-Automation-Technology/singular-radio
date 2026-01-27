export function formatTimestamp(seconds: number): string {
  const sec = Math.floor(seconds);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  if (h > 0) {
    return `${h}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

const ISO_DURATION_RE =
  /P(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;

export function formatIsoDuration(iso?: string | null): string {
  if (!iso) return "";
  const match = ISO_DURATION_RE.exec(iso);
  if (!match) return "";
  const h = Number(match[1] ?? 0);
  const m = Number(match[2] ?? 0);
  const s = Number(match[3] ?? 0);
  const totalSeconds = h * 3600 + m * 60 + s;
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "";
  return formatTimestamp(totalSeconds);
}
