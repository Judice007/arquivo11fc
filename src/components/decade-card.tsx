import Link from "next/link";

/** "Volte no tempo" tile — decadeLabel is e.g. "2020s". */
export function DecadeCard({ decadeLabel, href }: { decadeLabel: string; href: string }) {
  const numeral = decadeLabel.replace(/s$/, "");

  return (
    <Link
      href={href}
      className="group flex flex-1 min-w-[7rem] flex-col gap-3 rounded-lg border border-line bg-paper-raised px-6 py-7 transition-all hover:-translate-y-0.5 hover:shadow-card"
    >
      <span className="font-display text-4xl font-bold leading-none text-accent md:text-5xl">
        {numeral}
        <span className="text-2xl text-ink-faint md:text-3xl">s</span>
      </span>
      <span className="flex items-center gap-1 text-sm text-ink-muted transition-colors group-hover:text-accent">
        {decadeLabel} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
