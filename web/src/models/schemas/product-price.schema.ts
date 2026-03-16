import { Type, Static } from "@sinclair/typebox";

// ============== Product Price Schemas ==============

// Price interval enum
export const PriceIntervalSchema = Type.Union([
  Type.Literal("DAY"),
  Type.Literal("WEEK"),
  Type.Literal("MONTH"),
  Type.Literal("YEAR"),
]);

export type PriceInterval = Static<typeof PriceIntervalSchema>;

// Currency enum
export const CurrencySchema = Type.Union([
  Type.Literal("USD"),
  Type.Literal("EUR"),
  Type.Literal("BRL"),
]);

export type Currency = Static<typeof CurrencySchema>;

// Base product price schema (full model)
export const ProductPriceSchema = Type.Object({
  id: Type.String(),
  productId: Type.String(),
  amount: Type.Number(),
  currencyCode: Type.Union([CurrencySchema, Type.String()]),
  stripePriceId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  active: Type.Boolean(),
  archived: Type.Boolean(),
  intervalType: PriceIntervalSchema,
  intervalValue: Type.Number(),
  createdAt: Type.Date(),
  updatedAt: Type.Date(),
});

export type ProductPriceType = Static<typeof ProductPriceSchema>;

// Form schema for creating/updating product prices
// Using Pick to select fields for the form (excluding auto-generated fields)
export const ProductPriceFormSchema = Type.Object({
  id: Type.Optional(Type.String()),
  amount: Type.Number({ minimum: 0 }),
  currency: CurrencySchema,
  active: Type.Boolean(),
  intervalType: PriceIntervalSchema,
  intervalValue: Type.Number({ minimum: 1 }),
});

export type ProductPriceFormType = Static<typeof ProductPriceFormSchema>;