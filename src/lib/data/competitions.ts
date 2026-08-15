import { prisma } from "@/lib/db";

export function getCompetitions() {
  return prisma.competition.findMany({ orderBy: { name: "asc" } });
}

export function getCompetitionBySlug(slug: string) {
  return prisma.competition.findUnique({ where: { slug } });
}
