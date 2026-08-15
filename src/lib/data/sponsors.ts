import { prisma } from "@/lib/db";

export function getSponsors() {
  return prisma.sponsor.findMany({ orderBy: { name: "asc" } });
}

export function getSponsorBySlug(slug: string) {
  return prisma.sponsor.findUnique({ where: { slug } });
}
