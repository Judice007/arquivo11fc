"use client";

import Link from "next/link";
import { useState } from "react";

import { SearchBar } from "@/components/search-bar";
import { NAV_LINKS } from "@/lib/nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink"
      >
        <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          ) : (
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-nav-menu"
          className="absolute inset-x-0 top-full flex flex-col gap-4 border-b border-line bg-paper-raised px-4 py-4 shadow-card"
        >
          <SearchBar />
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm font-medium text-ink hover:bg-paper-muted"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
