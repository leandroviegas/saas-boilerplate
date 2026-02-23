import { Type, Static } from "@sinclair/typebox";
import { ProductPriceSchema } from "@/schemas/models/product.schema";
import { multiSchemaBuilder } from "@/schemas/schemas";
import { paginationSchema, metaSchema } from "@/schemas/pagination";

export const routesSchema = multiSchemaBuilder({
  getAllProductPrices: {
    tags: ["Product Prices"],
    querystring: Type.Intersect([
      paginationSchema,
      Type.Object({
        productId: Type.Optional(Type.String()),
      }),
    ]),
    response: {
      200: {
        data: Type.Array(ProductPriceSchema),
        meta: metaSchema
      }
    },
  },

  getProductPriceById: {
    tags: ["Product Prices"],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      200: {
        data: ProductPriceSchema,
      },
    },
  },

  createProductPrice: {
    tags: ["Product Prices"],
    body: Type.Intersect([Type.Omit(ProductPriceSchema, ["id", "createdAt", "updatedAt", "stripePriceId"]), Type.Object({
      productId: Type.String(),
    })]),
    response: {
      201: {
        data: ProductPriceSchema,
      },
    },
  },

  updateProductPrice: {
    tags: ["Product Prices"],
    params: Type.Object({
      id: Type.String(),
    }),
    body: Type.Omit(ProductPriceSchema, ["createdAt", "updatedAt", "stripePriceId"]),
    response: {
      200: {
        data: ProductPriceSchema,
      },
    },
  },

  deleteProductPrice: {
    tags: ["Product Prices"],
    params: Type.Object({
      id: Type.String(),
    }),
  },

  switchActiveProductPrice: {
    tags: ["Product Prices"],
    params: Type.Object({
      id: Type.String(),
    }),
  }
});

export type CreateProductPriceBodyType = Static<typeof routesSchema.createProductPrice.body>;
export type UpdateProductPriceBodyType = Static<typeof routesSchema.updateProductPrice.body>;
export type GetAllProductPricesQueryType = Static<typeof routesSchema.getAllProductPrices.querystring>;