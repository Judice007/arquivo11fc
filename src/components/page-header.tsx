import type { Crumb } from "@/components/breadcrumbs";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  action?: React.ReactNode;
}) {
  return (
    <div className="border-b border-line bg-paper-raised">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 md:px-6">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-wide text-brass">{eyebrow}</p>
            )}
            <h1 className="font-display text-3xl font-semibold uppercase tracking-tight text-ink md:text-4xl">
              {title}
            </h1>
            {description && <p className="mt-1 max-w-2xl text-sm text-ink-muted">{description}</p>}
          </div>
          {action}
        </div>
      </div>
    </div>
  );
}
