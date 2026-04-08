import { AsyncLocalStorage } from "node:async_hooks";
import { ExtendedPrismaClient } from "@/infrastructure/database/prisma/client";
import type { TransactionClient } from "@/core/types/prisma";

export type TransactionOptions = {
  timeout?: number;
  maxWait?: number;
  isolationLevel?: "ReadCommitted" | "RepeatableRead" | "Serializable";
};

const MAX_TIMEOUT_MS = 30_000;

const DEFAULT_TIMEOUT_MS = 5_000;

type TransactionStore = {
  client: TransactionClient;
  id: string;
};

export class PrismaTransactionContext {
  private storage = new AsyncLocalStorage<TransactionStore>();

  constructor(private readonly prisma: ExtendedPrismaClient) {
    if (!prisma) {
      throw new Error(
        "PrismaTransactionContext: prisma client is required but received undefined/null."
      );
    }
  }

  _getClient(): TransactionClient {
    return this.storage.getStore()?.client ?? (this.prisma as unknown as TransactionClient);
  }

  isInTransaction(): boolean {
    return this.storage.getStore() !== undefined;
  }

  currentTransactionId(): string | undefined {
    return this.storage.getStore()?.id;
  }

  async run<T>(
    callback: () => Promise<T>,
    options?: TransactionOptions
  ): Promise<T> {
    if (this.isInTransaction()) {
      if (process.env.NODE_ENV !== "production") {
        console.debug(
          `[PrismaTransactionContext] Reusing transaction ${this.currentTransactionId()} — nested run() call detected.`
        );
      }
      return callback();
    }

    const resolvedTimeout = Math.min(
      options?.timeout ?? DEFAULT_TIMEOUT_MS,
      MAX_TIMEOUT_MS
    );

    if (options?.timeout !== undefined && options.timeout > MAX_TIMEOUT_MS) {
      console.warn(
        `[PrismaTransactionContext] Requested timeout ${options.timeout}ms exceeds the maximum of ${MAX_TIMEOUT_MS}ms. Clamping to ${MAX_TIMEOUT_MS}ms.`
      );
    }

    const txId = crypto.randomUUID();

    return this.prisma.$transaction(
      (tx: TransactionClient) => {
        const store: TransactionStore = { client: tx, id: txId };
        return this.storage.run(store, () => callback());
      },
      {
        ...options,
        timeout: resolvedTimeout,
      }
    );
  }
}