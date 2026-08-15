import Link from "next/link";

import type { Club, Country, Kit, Manufacturer, NationalTeam } from "@/generated/prisma/client";
import { archiveTag } from "@/lib/archive-tag";
import { kitTypeLabel } from "@/lib/kit-types";
import { formatSeason } from "@/lib/season";

type ClubWithCountry = Club & { country: Country };
type NationalTeamWithCountry = NationalTeam & { country: Country };

export type KitCardKit = Kit & {
  club: ClubWithCountry | null;
  nationalTeam: NationalTeamWithCountry | null;
  manufacturer: Manufacturer | null;
};

export function KitCard({ kit }: { kit: KitCardKit }) {
  const owner = kit.club ?? kit.nationalTeam;
  const ownerName = owner?.name ?? "—";
  const tag = owner ? archiveTag({ type: kit.type, seasonStart: kit.seasonStart, country: owner.country }) : null;

  return (
    <Link
      href={`/uniformes/${kit.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-paper-raised shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-paper-muted">
        {kit.mainImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={kit.mainImageUrl}
            alt={`${ownerName} — ${kitTypeLabel(kit.type)} ${formatSeason(kit.seasonStart, kit.seasonEnd)}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="px-4 text-center text-xs text-ink-faint">Sem imagem</span>
        )}
        {kit.mainImageUrl && kit.mainImageSourceType === "DIGITAL_RECREATION" && (
          <span className="absolute left-2 top-2 rounded-full bg-paper-raised/90 px-2 py-0.5 text-[10px] font-medium text-ink-muted">
            Recriação digital
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <p className="truncate font-medium text-ink group-hover:text-accent">{ownerName}</p>
        <p className="text-sm text-ink-muted">
          {kitTypeLabel(kit.type)} · {formatSeason(kit.seasonStart, kit.seasonEnd)}
        </p>
        {kit.manufacturer && <p className="text-sm text-ink-muted">{kit.manufacturer.name}</p>}
        {tag && <p className="mt-1.5 text-[11px] uppercase tracking-wide text-ink-faint">{tag}</p>}
      </div>
    </Link>
  );
}
