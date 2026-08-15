import Link from "next/link";

export function SectionHeader({
  title,
  description,
  href,
  hrefLabel = "Ver todos",
}: {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="border-b border-line pb-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink md:text-base">
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:text-accent-strong"
          >
            {hrefLabel} →
          </Link>
        )}
      </div>
      {description && <p className="mt-2 text-sm text-ink-muted">{description}</p>}
    </div>
  );
}
