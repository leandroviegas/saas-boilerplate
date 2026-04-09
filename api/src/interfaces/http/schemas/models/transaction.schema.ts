import { t, Static } from "elysia";

export const TransactionSchema = t.Object({
  id: t.String(),
  userId: t.Nullable(t.String()),
  amount: t.Numeric(),
  currencyCode: t.String(),
  status: t.String(),
  paymentMethod: t.MaybeEmpty(t.String()),
  stripePaymentIntentId: t.MaybeEmpty(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type TransactionType = Static<typeof TransactionSchema>;