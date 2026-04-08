import type { TransactionClient } from "@/core/types/prisma";
import { PrismaTransactionContext } from "@/infrastructure/database/prisma/transaction-context";

export abstract class AbstractService {
  constructor(
    protected readonly transaction: PrismaTransactionContext
  ) {
    if (!transaction) {
      throw new Error(
        `${new.target.name}: PrismaTransactionContext is required but received undefined/null. ` +
        "Check your dependency injection configuration."
      );
    }
  }

  protected get prisma(): TransactionClient {
    return this.transaction._getClient();
  }
}