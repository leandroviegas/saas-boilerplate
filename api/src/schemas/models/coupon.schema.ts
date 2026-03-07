import { t } from "elysia";

export const DiscountTypeSchema = t.Union([
  t.Literal("PERCENTAGE"),
  t.Literal("FIXED"),
]);

export const CouponSchema = t.Object({
  id: t.String(),
  code: t.String(),
  discountType: DiscountTypeSchema,
  value: t.Number(),
  expiresAt: t.Optional(t.String({ format: "date-time" })),
  usageLimit: t.Optional(t.Number()),
  usageCount: t.Number(),
  active: t.Boolean(),
  stripeCouponId: t.Optional(t.String()),
  createdAt: t.String({ format: "date-time" }),
  updatedAt: t.String({ format: "date-time" }),
});