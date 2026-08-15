import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "@/generated/prisma/client";

// Prisma 7 requires an explicit driver adapter. `better-sqlite3` is used only
// in development; production points DATABASE_URL at Postgres and swaps this
// file's adapter for `@prisma/adapter-pg` (`new PrismaPg({ connectionString })`).
// No other file should need to change when that happens — this module is the
// only place that knows which database is behind Prisma.
function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
