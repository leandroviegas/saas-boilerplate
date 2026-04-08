import type { PrismaTransactionContext, TransactionOptions } from "@/infrastructure/database/prisma/transaction-context";

export function Transactional(options?: TransactionOptions) {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod: (...args: unknown[]) => Promise<unknown> = descriptor.value;

    if (typeof originalMethod !== "function") {
      throw new Error(
        `@Transactional() can only decorate methods. ` +
        `"${String(propertyKey)}" is not a function.`
      );
    }

    if (originalMethod.constructor.name !== "AsyncFunction") {
      throw new Error(
        `@Transactional() requires an async method. ` +
        `"${String(propertyKey)}" is synchronous. ` +
        "Wrap the method body in async or return a Promise."
      );
    }

    descriptor.value = async function (
      this: Record<string, unknown>,
      ...args: unknown[]
    ): Promise<unknown> {
      const txContext = this["transaction"];

      if (
        txContext === undefined ||
        txContext === null ||
        typeof (txContext as PrismaTransactionContext).run !== "function"
      ) {
        throw new Error(
          `@Transactional() on "${String(propertyKey)}": the host class must have a ` +
          "'transaction' property of type PrismaTransactionContext " +
          "(i.e. it must extend AbstractService). " +
          "Check your class definition and dependency injection setup."
        );
      }

      return (txContext as PrismaTransactionContext).run(
        () => originalMethod.apply(this, args),
        options
      );
    };

    return descriptor;
  };
}