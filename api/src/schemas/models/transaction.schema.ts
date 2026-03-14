import { t, Static } from "elysia";

export const TransactionSchema = t.Object({
  id: t.String(),
  userId: t.Union([t.String(), t.Null()]),
  amount: t.Numeric(),
  currencyCode: t.String(),
  status: t.String(),
  paymentMethod: t.Optional(t.Union([t.String(), t.Null()])),
  stripePaymentIntentId: t.Optional(t.Union([t.String(), t.Null()])),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type TransactionType = Static<typeof TransactionSchema>;