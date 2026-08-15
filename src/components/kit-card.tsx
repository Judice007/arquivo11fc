import Link from "next/link";

import type { Club, Kit, Manufacturer, NationalTeam } from "@/generated/prisma/client";
import { kitTypeLabel } from "@/lib/kit-types";
import { formatSeason } from "@/lib/season";

export type KitCardKit = Kit & {
  club: Club | null;
  nationalTeam: NationalTeam | null;
  manufacturer: Manufacturer | null;
};

export function KitCard({ kit }: { kit: KitCardKit }) {
  const ownerName = kit.club?.name ?? kit.nationalTeam?.name ?? "—";

  return (
    <Link
      href={`/uniformes/${kit.slug}`}
      className="group flex flex-col overflow-hidden rounded-md border border-line bg-paper-raised shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex aspect-[4/5] items-center justify-center bg-paper-muted">
        {kit.mainImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={kit.mainImageUrl}
            alt={`${ownerName} — ${kitTypeLabel(kit.type)} ${formatSeason(kit.seasonStart, kit.seasonEnd)}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="px-4 text-center text-xs text-ink-faint">Sem imagem</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <p className="truncate font-medium text-ink group-hover:text-accent">{ownerName}</p>
        <p className="text-xs text-ink-muted">
          {formatSeason(kit.seasonStart, kit.seasonEnd)} · {kitTypeLabel(kit.type)}
        </p>
        {kit.manufacturer && (
          <p className="text-xs uppercase tracking-wide text-ink-faint">{kit.manufacturer.name}</p>
        )}
      </div>
    </Link>
  );
}
