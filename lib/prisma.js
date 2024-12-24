import { PrismaClient } from "@prisma/client";

// Use a global Prisma Client instance in development to prevent multiple connections
const prisma = globalThis.prisma || new PrismaClient();

// Ensure Prisma is only assigned to globalThis in development mode
if (process.env.NODE_ENV !== "development") {
  globalThis.prisma = prisma;
}

export const db = prisma;
