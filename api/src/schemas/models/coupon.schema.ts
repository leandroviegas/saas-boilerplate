import { Type, Static } from "@sinclair/typebox";

export const DiscountTypeSchema = Type.Union([
  Type.Literal("PERCENTAGE"),
  Type.Literal("FIXED"),
]);

export const CouponSchema = Type.Object({
  id: Type.String(),
  code: Type.String(),
  discountType: DiscountTypeSchema,
  value: Type.Number(),
  expiresAt: Type.Optional(Type.String({ format: "date-time" })),
  usageLimit: Type.Optional(Type.Number()),
  usageCount: Type.Number(),
  active: Type.Boolean(),
  stripeCouponId: Type.Optional(Type.String()),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export type CouponType = Static<typeof CouponSchema>;
export type DiscountType = Static<typeof DiscountTypeSchema>;
