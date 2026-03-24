import type { PrismaTransactionContext } from "@/plugins/prisma-transaction-context";

/**
 * Wraps the decorated service method inside a Prisma transaction.
 * The method must belong to a class that has a `transaction` property
 * of type `PrismaTransactionContext` (i.e. extends `AbstractService`).
 *
 * Nested calls are safe: if a transaction is already active the same
 * client is reused instead of opening a new one.
 *
 * @example
 * ```ts
 * @Transactional()
 * async update(id: string, data: UpdateUserBodyType) { ... }
 * ```
 */
export function Transactional() {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod: (...args: Parameters<typeof descriptor.value>) => ReturnType<typeof descriptor.value> =
      descriptor.value;

    descriptor.value = function (this: Record<string, PrismaTransactionContext>, ...args: Parameters<typeof originalMethod>) {
      return this["transaction"].run(() => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}
