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
