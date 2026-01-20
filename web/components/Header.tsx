import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/episodes", label: "Episodes" },
  { href: "/learn", label: "Learn" },
  { href: "/community", label: "Community" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Singular Radio
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
