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
  expiresAt: t.MaybeEmpty(t.Date()),
  usageLimit: t.MaybeEmpty(t.Numeric()),
  usageCount: t.Numeric(),
  active: t.Boolean(),
  stripeCouponId: t.MaybeEmpty(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type CouponType = Static<typeof CouponSchema>;