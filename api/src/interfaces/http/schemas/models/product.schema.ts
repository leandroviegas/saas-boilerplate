import { t, Static } from "elysia";

export const PriceIntervalSchema = t.Union([
  t.Literal("DAY"),
  t.Literal("WEEK"),
  t.Literal("MONTH"),
  t.Literal("YEAR"),
]);

export const CurrencySchema = t.Union([
  t.Literal("USD"),
  t.Literal("EUR"),
  t.Literal("BRL"),
]);


export const ProductPriceSchema = t.Object({
  id: t.String(),
  productId: t.String(),
  amount: t.Numeric(),
  currencyCode: t.Union([CurrencySchema, t.String()]),
  stripePriceId: t.MaybeEmpty(t.String()),
  active: t.Boolean(),
  archived: t.Boolean(),
  intervalType: PriceIntervalSchema,
  intervalValue: t.Numeric(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});


export const ProductSchema = t.Object({
  id: t.String(),
  name: t.String({ minLength: 2, maxLength: 100 }),
  description: t.MaybeEmpty(t.String()),
  features: t.Array(t.String()),
  active: t.Boolean(),
  archived: t.Boolean(),
  permissions: t.Record(t.String(), t.Array(t.String())),
  stripeProductId: t.MaybeEmpty(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type ProductType = Static<typeof ProductSchema>;
export type ProductPriceType = Static<typeof ProductPriceSchema>;

export type CreateProductPriceType = {
  productId: string;
  amount: number;
  currencyCode: string;
  active: boolean;
  archived: boolean;
  intervalType: "DAY" | "WEEK" | "MONTH" | "YEAR";
  intervalValue: number;
};

export type UpdateProductPriceType = Partial<CreateProductPriceType>;
