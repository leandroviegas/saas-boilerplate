import type { TransactionClient } from "@/types/prisma";
import { PrismaTransactionContext } from "@/plugins/prisma-transaction-context";

export abstract class AbstractService {
  constructor(
    protected readonly transaction: PrismaTransactionContext
  ) {}

  protected get prisma(): TransactionClient {
    return this.transaction.getClient();
  }
}
