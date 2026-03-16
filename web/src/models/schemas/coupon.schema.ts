import { Type, Static } from "@sinclair/typebox";

// ============== Coupon Schemas ==============

// Discount type enum
export const DiscountTypeSchema = Type.Union([
  Type.Literal("PERCENTAGE"),
  Type.Literal("FIXED"),
]);

export type DiscountType = Static<typeof DiscountTypeSchema>;

// Base coupon schema (full model)
export const CouponSchema = Type.Object({
  id: Type.String(),
  code: Type.String(),
  discountType: DiscountTypeSchema,
  value: Type.Number(),
  expiresAt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  usageLimit: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  usageCount: Type.Number(),
  active: Type.Boolean(),
  stripeCouponId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export type CouponType = Static<typeof CouponSchema>;

// Form schema for creating/updating coupons - uses Pick to select required fields
export const CouponFormSchema = Type.Object({
  code: Type.String({ minLength: 1 }),
  discountType: DiscountTypeSchema,
  value: Type.Number({ minimum: 0 }),
  usageLimit: Type.Optional(Type.Number({ minimum: 1 })),
  active: Type.Boolean(),
  expiresAt: Type.Optional(Type.String({ format: "date-time" })),
});

// Use Partial for update operations - all fields optional
export const CouponUpdateSchema = Type.Partial(CouponFormSchema);

export type CouponFormType = Static<typeof CouponFormSchema>;
export type CouponUpdateType = Static<typeof CouponUpdateSchema>;