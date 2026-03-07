import { t, Static } from "elysia";

export const TransactionSchema = t.Object({
  id: t.String(),
  userId: t.String(),
  amount: t.Number(),
  currency: t.String(),
  status: t.String(),
  paymentMethod: t.Optional(t.String()),
  stripePaymentIntentId: t.Optional(t.String()),
  createdAt: t.String({ format: "date-time" }),
  updatedAt: t.String({ format: "date-time" }),
});