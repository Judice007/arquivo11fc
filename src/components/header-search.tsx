"use client";

import { useState } from "react";

import { SearchBar } from "@/components/search-bar";

export function HeaderSearch() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "Fechar busca" : "Buscar"}
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-muted"
      >
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-lg border border-line bg-paper-raised p-2 shadow-card-hover sm:w-80">
          <SearchBar autoFocus />
        </div>
      )}
    </div>
  );
}
