const YT_PATTERNS = [
  /youtube\.com\/watch\?v=([^&#/]+)/,
  /youtube\.com\/embed\/([^&#/]+)/,
  /youtu\.be\/([^&#?/]+)/,
];

export function youtubeEmbedUrl(input?: string | null): string | null {
  if (!input) return null;
  for (const re of YT_PATTERNS) {
    const m = input.match(re);
    if (m && m[1]) {
      return `https://www.youtube.com/embed/${m[1]}`;
    }
  }
  return null;
}
