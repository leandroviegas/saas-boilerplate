import { Type, Static } from "@sinclair/typebox";
import { ProductSchema } from "./product.schema";

export const SubscriptionStatusSchema = Type.Union([
  Type.Literal("ACTIVE"),
  Type.Literal("CANCELED"),
  Type.Literal("PAST_DUE"),
  Type.Literal("INCOMPLETE"),
  Type.Literal("TRIALING"),
]);

export const SubscriptionSchema = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  productId: Type.String(),
  product: Type.Optional(ProductSchema),
  status: SubscriptionStatusSchema,
  currentPeriodStart: Type.String({ format: "date-time" }),
  currentPeriodEnd: Type.String({ format: "date-time" }),
  cancelAtPeriodEnd: Type.Boolean(),
  stripeSubscriptionId: Type.Optional(Type.String()),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export type SubscriptionType = Static<typeof SubscriptionSchema>;
export type SubscriptionStatusType = Static<typeof SubscriptionStatusSchema>;
