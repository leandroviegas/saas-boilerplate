import { t } from "elysia";
import { ProductSchema } from "./product.schema";

export const SubscriptionStatusSchema = t.Union([
  t.Literal("ACTIVE"),
  t.Literal("CANCELED"),
  t.Literal("PAST_DUE"),
  t.Literal("INCOMPLETE"),
  t.Literal("TRIALING"),
]);

export const SubscriptionSchema = t.Object({
  id: t.String(),
  userId: t.String(),
  productId: t.String(),
  product: t.Optional(ProductSchema),
  status: SubscriptionStatusSchema,
  currentPeriodStart: t.String({ format: "date-time" }),
  currentPeriodEnd: t.String({ format: "date-time" }),
  cancelAtPeriodEnd: t.Boolean(),
  stripeSubscriptionId: t.Optional(t.String()),
  createdAt: t.String({ format: "date-time" }),
  updatedAt: t.String({ format: "date-time" }),
});
