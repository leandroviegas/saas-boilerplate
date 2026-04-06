import { ExtendedPrismaClient } from "@/infrastructure/database/prisma/client";

export type TransactionClient = Parameters<
  Parameters<ExtendedPrismaClient["$transaction"]>[0]
>[0];
