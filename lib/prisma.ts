import { PrismaClient } from "@/app/generated/prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // @ts-expect-error MongoDB adapter
  prisma = new PrismaClient();
} else {
  const globalForPrisma = global as unknown as { prisma: PrismaClient };

  if (!globalForPrisma.prisma) {
    // @ts-expect-error MongoDB adapter
    globalForPrisma.prisma = new PrismaClient();
  }

  prisma = globalForPrisma.prisma;
}

export default prisma;
