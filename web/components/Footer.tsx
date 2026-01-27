export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/80 py-10 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 text-sm text-slate-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Singular Radio</p>
          <div className="flex gap-4 text-sm font-medium text-slate-700">
            <a
              className="transition hover:text-sky-900"
              href="https://www.youtube.com/@SingularRadio"
            >
              YouTube
            </a>
            <a
              className="transition hover:text-sky-900"
              href="https://x.com/SingularRadio"
            >
              X
            </a>
            <a
              className="transition hover:text-sky-900"
              href="https://open.spotify.com/show/2nOYrpc9PhKQ5v7s81KzCW"
            >
              Spotify
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
