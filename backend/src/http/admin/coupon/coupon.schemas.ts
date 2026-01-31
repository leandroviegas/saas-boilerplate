import { Type, Static } from "@sinclair/typebox";
import { CouponSchema } from "@/schemas/models/coupon.schema";
import { multiSchemaBuilder } from "@/schemas/schemas";
import { paginationSchema, metaSchema } from "@/schemas/pagination";

export const routesSchema = multiSchemaBuilder({
  getAllCoupons: {
    tags: ["Coupons"],
    querystring: Type.Intersect([
      paginationSchema
    ]),
    response: {
      200: {
        data: Type.Array(CouponSchema),
        meta: metaSchema
      }
    },
  },

  getCouponById: {
    tags: ["Coupons"],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      200: {
        data: CouponSchema,
      },
    },
  },

  createCoupon: {
    tags: ["Coupons"],
    body: Type.Object({
      code: Type.String(),
      discountType: Type.Union([
        Type.Literal("PERCENTAGE"),
        Type.Literal("FIXED")
      ]),
      value: Type.Number(),
      expiresAt: Type.Optional(Type.String({ format: "date-time" })),
      usageLimit: Type.Optional(Type.Number()),
      usageCount: Type.Number(),
      active: Type.Boolean(),
      stripeCouponId: Type.Optional(Type.String()),
    }),
    response: {
      201: {
        data: CouponSchema,
      },
    },
  },

  updateCoupon: {
    tags: ["Coupons"],
    params: Type.Object({
      id: Type.String(),
    }),
    body: Type.Partial(Type.Omit(CouponSchema, ["id", "createdAt", "updatedAt"])),
    response: {
      200: {
        data: CouponSchema,
      },
    },
  },

  incrementUsage: {
    tags: ["Coupons"],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      200: {
        data: CouponSchema,
      },
    },
  },
});

export type CreateCouponBodyType = Static<typeof routesSchema.createCoupon.body>;
export type UpdateCouponBodyType = Static<typeof routesSchema.updateCoupon.body>;
export type GetAllCouponsQueryType = Static<typeof routesSchema.getAllCoupons.querystring>;