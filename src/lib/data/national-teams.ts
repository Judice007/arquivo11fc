import { prisma } from "@/lib/db";
import { isKitType } from "@/lib/kit-types";

export function getNationalTeams(filters: { continent?: string } = {}) {
  return prisma.nationalTeam.findMany({
    where: filters.continent ? { country: { continent: filters.continent } } : {},
    include: { country: true },
    orderBy: { name: "asc" },
  });
}

export function getNationalTeamBySlug(slug: string) {
  return prisma.nationalTeam.findUnique({
    where: { slug },
    include: { country: true },
  });
}

export function getNationalTeamKits(nationalTeamId: string, type?: string) {
  return prisma.kit.findMany({
    where: {
      nationalTeamId,
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

export async function getNationalTeamSeasons(nationalTeamId: string) {
  return prisma.kit.findMany({
    where: { nationalTeamId, status: "PUBLISHED" },
    select: { seasonStart: true, seasonEnd: true },
    distinct: ["seasonStart", "seasonEnd"],
    orderBy: [{ seasonStart: "desc" }, { seasonEnd: "desc" }],
  });
}
