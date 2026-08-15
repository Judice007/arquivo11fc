import Link from "next/link";

export function SectionHeader({
  title,
  description,
  href,
  hrefLabel = "Ver tudo",
}: {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-semibold uppercase tracking-tight text-ink md:text-2xl">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-accent transition-colors hover:text-accent-strong"
        >
          {hrefLabel} →
        </Link>
      )}
    </div>
  );
}
