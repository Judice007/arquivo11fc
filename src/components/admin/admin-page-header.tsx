import Link from "next/link";

export function AdminPageHeader({
  title,
  description,
  addHref,
  addLabel = "Adicionar",
}: {
  title: string;
  description?: string;
  addHref?: string;
  addLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {addHref && (
        <Link href={addHref} className="btn-primary">
          {addLabel}
        </Link>
      )}
    </div>
  );
}
