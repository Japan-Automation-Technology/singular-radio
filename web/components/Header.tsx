"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Singular Radio
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-700 md:flex">
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
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </div>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-40 md:hidden">
              <button
                type="button"
                aria-label="Close menu"
                className="absolute inset-0 bg-slate-900/40"
                onClick={() => setOpen(false)}
              />
              <aside className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-700">Menu</span>
                  <button
                    type="button"
                    className="rounded-full px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
                <nav className="flex flex-col gap-1 p-3 text-sm font-semibold text-slate-800">
                  {nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-lg px-3 py-2 hover:bg-slate-100"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </aside>
            </div>,
            document.body
          )
        : null}
    </header>
  );
}
