import { t, Static } from "elysia";

export const DiscountTypeSchema = t.Union([
  t.Literal("PERCENTAGE"),
  t.Literal("FIXED"),
]);

export const CouponSchema = t.Object({
  id: t.String(),
  code: t.String(),
  discountType: DiscountTypeSchema,
  value: t.Number(),
  expiresAt: t.Optional(t.Union([t.Date(), t.Null()])),
  usageLimit: t.Optional(t.Union([t.Numeric(), t.Null()])),
  usageCount: t.Numeric(),
  active: t.Boolean(),
  stripeCouponId: t.Optional(t.Union([t.String(), t.Null()])),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type CouponType = Static<typeof CouponSchema>;