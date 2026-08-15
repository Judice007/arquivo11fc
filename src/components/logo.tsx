import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 font-display uppercase tracking-tight ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent text-sm font-bold text-paper transition-colors group-hover:bg-accent-strong">
        11
      </span>
      <span className="text-lg font-semibold text-ink">Arquivo 11</span>
    </Link>
  );
}
