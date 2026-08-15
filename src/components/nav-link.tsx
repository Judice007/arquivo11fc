"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`relative inline-block pb-4 text-sm font-medium transition-colors ${
        isActive ? "text-ink" : "text-ink-muted hover:text-ink"
      }`}
    >
      {label}
      {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />}
    </Link>
  );
}
