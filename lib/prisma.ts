import { PrismaClient } from "@prisma/client";

// Force binary engine to avoid Prisma Client "client" engine requirements.
process.env.PRISMA_CLIENT_ENGINE_TYPE ??= "binary";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
