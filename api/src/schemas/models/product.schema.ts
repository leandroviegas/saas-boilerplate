import { Type, Static } from "@sinclair/typebox";

export const PriceIntervalSchema = Type.Union([
  Type.Literal("DAY"),
  Type.Literal("WEEK"),
  Type.Literal("MONTH"),
  Type.Literal("YEAR"),
]);

export const CurrencySchema = Type.Union([
  Type.Literal("USD"),
  Type.Literal("EUR"),
  Type.Literal("BRL"),
]);

export const ProductPriceSchema = Type.Object({
  id: Type.String(),
  productId: Type.String(),
  amount: Type.Number(),
  currencyCode: CurrencySchema,
  stripePriceId: Type.Optional(Type.String()),
  active: Type.Boolean(),
  archived: Type.Boolean(),
  intervalType: PriceIntervalSchema,
  intervalValue: Type.Number({ default: 1, minimum: 1, maximum: 1000 }),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export const ProductSchema = Type.Object({
  id: Type.String(),
  name: Type.String({ minLength: 2, maxLength: 100 }),
  description: Type.Optional(Type.String()),
  features: Type.Array(Type.String()),
  active: Type.Boolean(),
  archived: Type.Boolean(),
  permissions: Type.Record(Type.String(), Type.Array(Type.String())),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export type ProductType = Static<typeof ProductSchema>;
export type ProductPriceType = Static<typeof ProductPriceSchema>;
export type PriceIntervalType = Static<typeof PriceIntervalSchema>;
