import { t } from "elysia";

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
  amount: t.Number(),
  currencyCode: CurrencySchema,
  stripePriceId: t.Optional(t.String()),
  active: t.Boolean(),
  archived: t.Boolean(),
  intervalType: PriceIntervalSchema,
  intervalValue: t.Number({ default: 1, minimum: 1, maximum: 1000 }),
  createdAt: t.String({ format: "date-time" }),
  updatedAt: t.String({ format: "date-time" }),
});

export const ProductSchema = t.Object({
  id: t.String(),
  name: t.String({ minLength: 2, maxLength: 100 }),
  description: t.Optional(t.String()),
  features: t.Array(t.String()),
  active: t.Boolean(),
  archived: t.Boolean(),
  permissions: t.Record(t.String(), t.Array(t.String())),
  createdAt: t.String({ format: "date-time" }),
  updatedAt: t.String({ format: "date-time" }),
});
