import { ExtendedPrismaClient } from "@/plugins/prisma";

export type TransactionClient = Parameters<
  Parameters<ExtendedPrismaClient["$transaction"]>[0]
>[0];
