import { t } from "elysia";
import { PriceIntervalSchema, CurrencySchema } from "@/schemas/models/product.schema";

export const CreateProductPriceBodySchema = t.Object({
  productId: t.String(),
  amount: t.Number(),
  currencyCode: CurrencySchema,
  active: t.Boolean({ default: true }),
  intervalType: PriceIntervalSchema,
  intervalValue: t.Number({ default: 1, minimum: 1, maximum: 1000 }),
});

export type CreateProductPriceBodyType = typeof CreateProductPriceBodySchema.static;

export const UpdateProductPriceBodySchema = t.Object({
  amount: t.Optional(t.Number()),
  currencyCode: t.Optional(CurrencySchema),
  active: t.Optional(t.Boolean()),
  intervalType: t.Optional(PriceIntervalSchema),
  intervalValue: t.Optional(t.Number({ minimum: 1, maximum: 1000 })),
});

export type UpdateProductPriceBodyType = typeof UpdateProductPriceBodySchema.static;
