import { Type, Static } from "@sinclair/typebox";
import { ProductSchema, ProductPriceSchema } from "@/schemas/models/product.schema";
import { multiSchemaBuilder } from "@/schemas/schemas";
import { paginationSchema, metaSchema } from "@/schemas/pagination";


export const routesSchema = multiSchemaBuilder({
  getAllProducts: {
    tags: ["Products"],
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
      }
    },
  },

  getProductById: {
    tags: ["Products"],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      200: {
        data: Type.Intersect([
          ProductSchema,
          Type.Object({
            prices: Type.Optional(Type.Array(ProductPriceSchema)),
          })
        ]),
      },
    },
  },

  createProduct: {
    tags: ["Products"],
    body: Type.Omit(ProductSchema, ["id", "createdAt", "updatedAt"]),
    response: {
      201: {
        data: ProductSchema,
      },
    },
  },

  updateProduct: {
    tags: ["Products"],
    params: Type.Object({
      id: Type.String(),
    }),
    body: Type.Omit(ProductSchema, ["createdAt", "updatedAt"]),
    response: {
      200: {
        data: ProductSchema,
      },
    },
  },

  deleteProduct: {
    tags: ["Products"],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      200: {
        data:  ProductSchema,
      },
    },
  },

  switchActiveProduct: {
    tags: ["Products"],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      200: {
        data: ProductSchema,
      },
    },
  },

  switchArchiveProduct: {
    tags: ["Products"],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      200: {
        data: ProductSchema,
      },
    },
  },
});

export type CreateProductBodyType = Static<typeof routesSchema.createProduct.body>;
export type UpdateProductBodyType = Static<typeof routesSchema.updateProduct.body>;
export type GetAllProductsQueryType = Static<typeof routesSchema.getAllProducts.querystring>;
