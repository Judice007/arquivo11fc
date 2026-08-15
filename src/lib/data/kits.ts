import { prisma } from "@/lib/db";

const KIT_DETAIL_INCLUDE = {
  club: { include: { country: true } },
  nationalTeam: { include: { country: true } },
  manufacturer: true,
  mainSponsor: true,
  images: { orderBy: { sortOrder: "asc" } },
  competitions: { include: { competition: true } },
} as const;

// club.country / nationalTeam.country são usados pela tag de arquivo do KitCard
// ("A11 · BRA · 2009 · HOME") — ver src/lib/archive-tag.ts.
const KIT_CARD_INCLUDE = {
  club: { include: { country: true } },
  nationalTeam: { include: { country: true } },
  manufacturer: true,
} as const;

export function getKitBySlug(slug: string) {
  return prisma.kit.findUnique({
    where: { slug },
    include: KIT_DETAIL_INCLUDE,
  });
}

export function getKitById(id: string) {
  return prisma.kit.findUnique({
    where: { id },
    include: KIT_DETAIL_INCLUDE,
  });
}

/** All kits, most recently created first — used by the admin list. See caveat below. */
export function getKitsForAdmin(limit = 300) {
  // Sem paginação real ainda (fora do escopo do MVP — ver docs/PROJECT_SPEC.md,
  // seção Performance): um `take` alto evita carregar o banco inteiro de uma vez
  // conforme o catálogo crescer, mas uma lista paginada de verdade é o próximo passo.
  return prisma.kit.findMany({
    include: { club: true, nationalTeam: true, manufacturer: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export function getRecentKits(limit = 8) {
  return prisma.kit.findMany({
    include: KIT_CARD_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/** Other kits from the same club/national team and the same season, excluding the given kit. */
export function getOtherKitsSameSeason(kit: {
  id: string;
  clubId: string | null;
  nationalTeamId: string | null;
  seasonStart: number;
  seasonEnd: number;
}) {
  return prisma.kit.findMany({
    where: {
      id: { not: kit.id },
      seasonStart: kit.seasonStart,
      seasonEnd: kit.seasonEnd,
      ...(kit.clubId ? { clubId: kit.clubId } : { nationalTeamId: kit.nationalTeamId }),
    },
    include: KIT_CARD_INCLUDE,
    orderBy: { type: "asc" },
  });
}

/** Kits touching a given calendar year, either as a single-year season or as either edge of a split season. */
export function getKitsByYear(year: number) {
  return prisma.kit.findMany({
    where: { OR: [{ seasonStart: year }, { seasonEnd: year }] },
    include: KIT_CARD_INCLUDE,
    orderBy: [{ seasonStart: "desc" }],
  });
}

export async function getRandomKit() {
  const ids = await prisma.kit.findMany({ select: { id: true } });
  if (ids.length === 0) return null;
  const pick = ids[Math.floor(Math.random() * ids.length)];
  return prisma.kit.findUnique({ where: { id: pick.id }, include: KIT_DETAIL_INCLUDE });
}

export async function getAvailableSeasonYears() {
  const kits = await prisma.kit.findMany({
    select: { seasonStart: true, seasonEnd: true },
  });
  const years = new Set<number>();
  for (const kit of kits) {
    years.add(kit.seasonStart);
    years.add(kit.seasonEnd);
  }
  return Array.from(years).sort((a, b) => b - a);
}

/** The slug + display name of whichever owner (club or national team) a kit belongs to. */
export function kitOwner(kit: {
  club: { slug: string; name: string } | null;
  nationalTeam: { slug: string; name: string } | null;
}) {
  if (kit.club) return { kind: "club" as const, slug: kit.club.slug, name: kit.club.name };
  if (kit.nationalTeam)
    return { kind: "nationalTeam" as const, slug: kit.nationalTeam.slug, name: kit.nationalTeam.name };
  throw new Error("Kit sem clube nem seleção associada.");
}
