import { Type, Static } from "@sinclair/typebox";
import { multiSchemaBuilder } from "@/schemas/schemas";
import { ProductSchema, ProductPriceSchema } from "@/schemas/models/product.schema";
import { SubscriptionSchema } from "@/schemas/models/subscription.schema";
import { TransactionSchema } from "@/schemas/models/transaction.schema";
import { paginationSchema, metaSchema } from "@/schemas/pagination";

export const routesSchema = multiSchemaBuilder({
  getProducts: {
    tags: ["Payment"],
    querystring: Type.Intersect([
      paginationSchema
    ]),
    response: {
      200: {
        data: Type.Array(
          Type.Intersect([
            ProductSchema,
            Type.Object({
              prices: Type.Optional(Type.Array(ProductPriceSchema)),
            })
          ])
        ),
        meta: metaSchema
      },
    },
  },

  createCheckoutSession: {
    tags: ["Payment"],
    body: Type.Object({
      productPriceId: Type.String(),
      promotionCode: Type.Optional(Type.String()),
    }),
    response: {
      200: {
        data: Type.Object({
          url: Type.String(),
        }),
      },
    },
  },

  getSubscription: {
    tags: ["Payment"],
    response: {
      200: {
        data: Type.Optional(SubscriptionSchema),
      },
    },
  },

  cancelSubscription: {
    tags: ["Payment"],
    response: {
      200: {
        message: Type.String(),
      },
    },
  },

  getTransactions: {
    tags: ["Payment"],
    querystring: Type.Intersect([
      paginationSchema
    ]),
    response: {
      200: {
        data: Type.Array(TransactionSchema),
        meta: metaSchema
      },
    },
  },
});

export type CreateCheckoutSessionBodyType = Static<typeof routesSchema.createCheckoutSession.body>;
export type GetProductsQueryType = Static<typeof routesSchema.getProducts.querystring>;
export type GetTransactionsQueryType = Static<typeof routesSchema.getTransactions.querystring>;
