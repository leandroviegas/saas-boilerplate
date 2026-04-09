import { t, Static } from "elysia";
import { ProductSchema } from "./product.schema";

export const SubscriptionStatusSchema = t.Union([
  t.Literal("ACTIVE"),
  t.Literal("CANCELED"),
  t.Literal("PAST_DUE"),
  t.Literal("INCOMPLETE"),
  t.Literal("TRIALING"),
  t.Literal("INCOMPLETE_EXPIRED"),
  t.Literal("UNPAID"),
]);

export const SubscriptionSchema = t.Object({
  id: t.String(),
  organizationId: t.String(),
  productId: t.String(),
  product: t.Optional(ProductSchema),
  status: SubscriptionStatusSchema,
  currentPeriodStart: t.Date(),
  currentPeriodEnd: t.Date(),
  cancelAtPeriodEnd: t.Boolean(),
  stripeSubscriptionId: t.MaybeEmpty(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type SubscriptionType = Static<typeof SubscriptionSchema>;
