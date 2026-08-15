import { prisma } from "@/lib/db";

export function getCountries() {
  return prisma.country.findMany({ orderBy: { name: "asc" } });
}

export function getCountryBySlug(slug: string) {
  return prisma.country.findUnique({ where: { slug } });
}

/** Continents that currently have at least one club, for the /clubes filter. */
export async function getContinentsWithClubs() {
  const countries = await prisma.country.findMany({
    where: { clubs: { some: {} } },
    select: { continent: true },
    distinct: ["continent"],
  });
  return countries.map((c) => c.continent).sort();
}

export async function getCountriesWithClubs(continent?: string) {
  return prisma.country.findMany({
    where: {
      clubs: { some: {} },
      ...(continent ? { continent } : {}),
    },
    orderBy: { name: "asc" },
  });
}
