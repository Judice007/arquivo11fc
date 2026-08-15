import Link from "next/link";

import type { Manufacturer } from "@/generated/prisma/client";

export function ManufacturerCard({ manufacturer }: { manufacturer: Manufacturer }) {
  return (
    <Link
      href={`/marcas/${manufacturer.slug}`}
      className="group flex flex-col items-center justify-center gap-3 rounded-md border border-line bg-paper-raised p-6 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex h-12 w-full items-center justify-center">
        {manufacturer.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={manufacturer.logoUrl}
            alt={manufacturer.name}
            className="max-h-12 max-w-full object-contain"
          />
        ) : (
          <span className="font-display text-base font-semibold text-ink-faint">
            {manufacturer.name}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-ink group-hover:text-accent">{manufacturer.name}</p>
    </Link>
  );
}
