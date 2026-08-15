import Link from "next/link";

import { KIT_TYPES, kitTypeLabel } from "@/lib/kit-types";

export function KitTypeFilter({
  basePath,
  activeType,
}: {
  basePath: string;
  activeType?: string;
}) {
  const options = [{ value: undefined, label: "Todos" }, ...KIT_TYPES.map((t) => ({ value: t, label: kitTypeLabel(t) }))];

  return (
    <nav aria-label="Filtrar por tipo de uniforme" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <ul className="flex gap-2">
        {options.map((option) => {
          const isActive = option.value === activeType || (!option.value && !activeType);
          const href = option.value ? `${basePath}?tipo=${option.value}` : basePath;
          return (
            <li key={option.label}>
              <Link
                href={href}
                className={`inline-flex whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink-muted hover:border-ink hover:text-ink"
                }`}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
