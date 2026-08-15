import type { Club, Country, Manufacturer, NationalTeam } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import type { KitCardKit } from "@/components/kit-card";

export type SearchResults = {
  clubs: (Club & { country: Country })[];
  nationalTeams: (NationalTeam & { country: Country })[];
  manufacturers: Manufacturer[];
  kits: KitCardKit[];
  season: { seasonStart: number; seasonEnd: number } | null;
};

/**
 * Global search across clubs, national teams, manufacturers, individual kits
 * (PUBLISHED only) and (if the query looks like a year) seasons. Kept intentionally
 * simple for the MVP — see docs/PROJECT_SPEC.md's "fora de escopo" section for
 * advanced filtering.
 */
export async function globalSearch(query: string): Promise<SearchResults> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { clubs: [], nationalTeams: [], manufacturers: [], kits: [], season: null };
  }

  const yearMatch = /^\d{4}$/.exec(trimmed);

  const [clubs, nationalTeams, manufacturers, kits] = await Promise.all([
    prisma.club.findMany({
      where: { OR: [{ name: { contains: trimmed } }, { fullName: { contains: trimmed } }] },
      include: { country: true },
      take: 8,
    }),
    prisma.nationalTeam.findMany({
      where: { name: { contains: trimmed } },
      include: { country: true },
      take: 8,
    }),
    prisma.manufacturer.findMany({
      where: { name: { contains: trimmed } },
      take: 8,
    }),
    prisma.kit.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { club: { name: { contains: trimmed } } },
          { club: { fullName: { contains: trimmed } } },
          { nationalTeam: { name: { contains: trimmed } } },
        ],
      },
      include: { club: { include: { country: true } }, nationalTeam: { include: { country: true } }, manufacturer: true },
      take: 8,
    }),
  ]);

  return {
    clubs,
    nationalTeams,
    manufacturers,
    kits,
    season: yearMatch ? { seasonStart: Number(trimmed), seasonEnd: Number(trimmed) } : null,
  };
}
