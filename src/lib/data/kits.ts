import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { isKitType } from "@/lib/kit-types";
import { isKitStatus } from "@/lib/kit-status";

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

// Uniformes DRAFT nunca aparecem nas páginas públicas — todas as funções abaixo que
// alimentam o site (não o /admin) filtram por isso. `getKitsForAdmin`/`getKitById`
// são as exceções deliberadas.
const PUBLISHED: Prisma.KitWhereInput = { status: "PUBLISHED" };

export function getKitBySlug(slug: string) {
  return prisma.kit.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: KIT_DETAIL_INCLUDE,
  });
}

export function getKitById(id: string) {
  return prisma.kit.findUnique({
    where: { id },
    include: KIT_DETAIL_INCLUDE,
  });
}

export type AdminKitFilters = {
  ownerType?: "club" | "nationalTeam";
  ownerId?: string;
  type?: string;
  status?: string;
  seasonYear?: number;
  search?: string;
};

/** All kits for the admin list, most recently updated first. See pagination caveat below. */
export function getKitsForAdmin(filters: AdminKitFilters = {}, limit = 300) {
  const conditions: Prisma.KitWhereInput[] = [];

  if (filters.ownerType === "club" && filters.ownerId) conditions.push({ clubId: filters.ownerId });
  if (filters.ownerType === "nationalTeam" && filters.ownerId) conditions.push({ nationalTeamId: filters.ownerId });
  if (filters.type && isKitType(filters.type)) conditions.push({ type: filters.type });
  if (filters.status && isKitStatus(filters.status)) conditions.push({ status: filters.status });
  if (filters.seasonYear) {
    conditions.push({ OR: [{ seasonStart: filters.seasonYear }, { seasonEnd: filters.seasonYear }] });
  }
  if (filters.search) {
    const search = filters.search;
    conditions.push({
      OR: [
        { slug: { contains: search } },
        { club: { name: { contains: search } } },
        { nationalTeam: { name: { contains: search } } },
      ],
    });
  }

  // Sem paginação real ainda (fora do escopo do MVP — ver docs/PROJECT_SPEC.md,
  // seção Performance): um `take` alto evita carregar o banco inteiro de uma vez
  // conforme o catálogo crescer, mas uma lista paginada de verdade é o próximo passo.
  return prisma.kit.findMany({
    where: conditions.length > 0 ? { AND: conditions } : undefined,
    include: { club: true, nationalTeam: true, manufacturer: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

/** Registra uma visualização da ficha pública do uniforme (chamado via `after()`, fora do path de resposta). */
export function recordKitView(id: string) {
  return prisma.kit.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
}

/** Registra um clique vindo da busca interna, para o ranking "mais buscado". */
export function recordKitSearchClick(id: string) {
  return prisma.kit.update({ where: { id }, data: { searchClickCount: { increment: 1 } } }).catch(() => {});
}

export function getRecentKits(limit = 8) {
  return prisma.kit.findMany({
    where: PUBLISHED,
    include: KIT_CARD_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export type HeroKits = {
  recent: Prisma.KitGetPayload<{ include: typeof KIT_CARD_INCLUDE }> | null;
  searched: Prisma.KitGetPayload<{ include: typeof KIT_CARD_INCLUDE }> | null;
  viewed: Prisma.KitGetPayload<{ include: typeof KIT_CARD_INCLUDE }> | null;
};

/**
 * Os 3 uniformes dos cards do hero da Home: mais recente publicado, mais buscado
 * (searchClickCount) e mais visualizado (viewCount) — sem repetir o mesmo uniforme
 * entre os 3 cards. Quando não há dado positivo de busca/visualização ainda (site
 * novo), cai para o próximo uniforme publicado ainda não usado, e por fim reaproveita
 * `recent` como último recurso, para nunca deixar um card vazio.
 */
export async function getHeroKits(): Promise<HeroKits> {
  const used = new Set<string>();

  const recent = await prisma.kit.findFirst({
    where: PUBLISHED,
    include: KIT_CARD_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  if (recent) used.add(recent.id);

  async function pickRanked(orderField: "viewCount" | "searchClickCount") {
    const ranked = await prisma.kit.findMany({
      where: PUBLISHED,
      include: KIT_CARD_INCLUDE,
      orderBy: [{ [orderField]: "desc" }, { createdAt: "desc" }],
      take: 10,
    });
    const withActivity = ranked.find((kit) => !used.has(kit.id) && kit[orderField] > 0);
    if (withActivity) return withActivity;

    const fallback = await prisma.kit.findMany({
      where: PUBLISHED,
      include: KIT_CARD_INCLUDE,
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const unused = fallback.find((kit) => !used.has(kit.id));
    return unused ?? recent ?? null;
  }

  const viewed = await pickRanked("viewCount");
  if (viewed) used.add(viewed.id);

  const searched = await pickRanked("searchClickCount");
  if (searched) used.add(searched.id);

  return { recent, searched, viewed };
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
      ...PUBLISHED,
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
    where: { ...PUBLISHED, OR: [{ seasonStart: year }, { seasonEnd: year }] },
    include: KIT_CARD_INCLUDE,
    orderBy: [{ seasonStart: "desc" }],
  });
}

export async function getRandomKit() {
  const ids = await prisma.kit.findMany({ where: PUBLISHED, select: { id: true } });
  if (ids.length === 0) return null;
  const pick = ids[Math.floor(Math.random() * ids.length)];
  return prisma.kit.findUnique({ where: { id: pick.id }, include: KIT_DETAIL_INCLUDE });
}

export async function getAvailableSeasonYears() {
  const kits = await prisma.kit.findMany({
    where: PUBLISHED,
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
