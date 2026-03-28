import { AsyncLocalStorage } from "node:async_hooks";
import { ExtendedPrismaClient } from "@/plugins/prisma";
import type { TransactionClient } from "@/types/prisma";

export type TransactionOptions = {
  timeout?: number;
  maxWait?: number;
  isolationLevel?: "ReadUncommitted" | "ReadCommitted" | "RepeatableRead" | "Serializable";
};

export class PrismaTransactionContext {
  private storage = new AsyncLocalStorage<TransactionClient>();

  constructor(private readonly prisma: ExtendedPrismaClient) {}

  getClient(): TransactionClient {
    // The transaction client satisfies PrismaClient's query API
    return (this.storage.getStore() ?? this.prisma) as TransactionClient;
  }

  isInTransaction(): boolean {
    return this.storage.getStore() !== undefined;
  }

  async run<T>(
    callback: () => Promise<T>,
    options?: TransactionOptions
  ): Promise<T> {
    // Already inside a transaction — reuse it (REQUIRED semantics)
    if (this.isInTransaction()) {
      return callback();
    }

    return this.prisma.$transaction(
      (tx: TransactionClient) => this.storage.run(tx, () => callback()),
      options
    );
  }
}
