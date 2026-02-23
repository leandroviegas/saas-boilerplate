import { Type, Static } from "@sinclair/typebox";

export const TransactionSchema = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  amount: Type.Number(),
  currency: Type.String(),
  status: Type.String(),
  paymentMethod: Type.Optional(Type.String()),
  stripePaymentIntentId: Type.Optional(Type.String()),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export type TransactionType = Static<typeof TransactionSchema>;
