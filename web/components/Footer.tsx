export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 text-sm text-slate-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Singular Radio</p>
          <div className="flex gap-4">
            <a
              className="hover:text-slate-900"
              href="https://www.youtube.com/@SingularRadio"
            >
              YouTube
            </a>
            <a
              className="hover:text-slate-900"
              href="https://x.com/SingularRadio"
            >
              X
            </a>
            <a
              className="hover:text-slate-900"
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
