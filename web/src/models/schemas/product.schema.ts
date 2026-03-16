import { Type, Static } from "@sinclair/typebox";

// ============== Product Schemas ==============

// Base product schema (full model)
export const ProductSchema = Type.Object({
  id: Type.String(),
  name: Type.String({ minLength: 2, maxLength: 100 }),
  description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  features: Type.Array(Type.String()),
  active: Type.Boolean(),
  archived: Type.Boolean(),
  permissions: Type.Record(Type.String(), Type.Array(Type.String())),
  stripeProductId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  createdAt: Type.Date(),
  updatedAt: Type.Date(),
});

export type ProductType = Static<typeof ProductSchema>;

// Form schema for creating/updating products - explicit definition
export const ProductFormSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String()),
  features: Type.Array(Type.String()),
  permissions: Type.Record(Type.String(), Type.Array(Type.String())),
});

export type ProductFormType = Static<typeof ProductFormSchema>;