import { prisma } from "@/lib/db";
import { isKitType } from "@/lib/kit-types";

export type ClubFilters = {
  continent?: string;
  countrySlug?: string;
  query?: string;
  sort?: "nome" | "fundacao";
};

export function getClubs(filters: ClubFilters = {}) {
  const { continent, countrySlug, query, sort = "nome" } = filters;

  return prisma.club.findMany({
    where: {
      country: {
        ...(continent ? { continent } : {}),
        ...(countrySlug ? { slug: countrySlug } : {}),
      },
      // `contains` without `mode: "insensitive"` on purpose: SQLite's LIKE is
      // already ASCII case-insensitive, and `mode: "insensitive"` isn't
      // supported by the SQLite connector. Postgres will need `mode: "insensitive"`
      // added here to keep the same case-insensitive behavior after migrating.
      ...(query
        ? {
            OR: [
              { name: { contains: query } },
              { fullName: { contains: query } },
            ],
          }
        : {}),
    },
    include: { country: true },
    orderBy: sort === "fundacao" ? { foundedYear: "asc" } : { name: "asc" },
  });
}

export function getFeaturedClubs(limit = 8) {
  return prisma.club.findMany({
    include: { country: true },
    orderBy: { name: "asc" },
    take: limit,
  });
}

export function getClubBySlug(slug: string) {
  return prisma.club.findUnique({
    where: { slug },
    include: { country: true },
  });
}

/** Distinct seasons (most recent first) for which a club has at least one published kit. */
export async function getClubSeasons(clubId: string) {
  const kits = await prisma.kit.findMany({
    where: { clubId, status: "PUBLISHED" },
    select: { seasonStart: true, seasonEnd: true },
    distinct: ["seasonStart", "seasonEnd"],
    orderBy: [{ seasonStart: "desc" }, { seasonEnd: "desc" }],
  });
  return kits;
}

export function getClubKits(clubId: string, type?: string) {
  return prisma.kit.findMany({
    where: {
      clubId,
      status: "PUBLISHED",
      ...(type && isKitType(type) ? { type } : {}),
    },
    include: {
      manufacturer: true,
      club: { include: { country: true } },
      nationalTeam: { include: { country: true } },
    },
    orderBy: [{ seasonStart: "desc" }, { type: "asc" }],
  });
}

export function getClubSeasonKits(clubId: string, seasonStart: number, seasonEnd: number) {
  return prisma.kit.findMany({
    where: { clubId, seasonStart, seasonEnd, status: "PUBLISHED" },
    include: {
      manufacturer: true,
      mainSponsor: true,
      club: { include: { country: true } },
      nationalTeam: { include: { country: true } },
    },
    orderBy: { type: "asc" },
  });
}
