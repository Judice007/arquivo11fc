import { prisma } from "@/lib/db";

export function getManufacturers() {
  return prisma.manufacturer.findMany({
    orderBy: { name: "asc" },
  });
}

export function getManufacturerBySlug(slug: string) {
  return prisma.manufacturer.findUnique({ where: { slug } });
}

export function getManufacturerKits(manufacturerId: string) {
  return prisma.kit.findMany({
    where: { manufacturerId, status: "PUBLISHED" },
    include: {
      club: { include: { country: true } },
      nationalTeam: { include: { country: true } },
      manufacturer: true,
    },
    orderBy: [{ seasonStart: "desc" }],
  });
}

/** Manufacturers with at least one published kit, for the "explore by manufacturer" section. */
export async function getManufacturersWithKitCount(limit?: number) {
  const manufacturers = await prisma.manufacturer.findMany({
    include: { _count: { select: { kits: { where: { status: "PUBLISHED" } } } } },
    orderBy: { name: "asc" },
  });
  const withKits = manufacturers.filter((m) => m._count.kits > 0);
  return typeof limit === "number" ? withKits.slice(0, limit) : withKits;
}
