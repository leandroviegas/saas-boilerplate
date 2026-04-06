import type { TransactionClient } from "@/core/types/prisma";
import { PrismaTransactionContext } from "@/infrastructure/database/prisma/transaction-context";

export abstract class AbstractService {
  constructor(
    protected readonly transaction: PrismaTransactionContext
  ) {}

  protected get prisma(): TransactionClient {
    return this.transaction.getClient();
  }
}
