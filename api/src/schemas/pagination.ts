import { Static, Type } from "@sinclair/typebox";

export const paginationSchema = Type.Object({
  page: Type.Optional(Type.Integer({ default: 1, minimum: 1 })),
  perPage: Type.Optional(Type.Integer({ default: 20, minimum: 1 })),
});

export type PaginationType = Static<typeof paginationSchema>;

export const metaSchema = Type.Object({
  total: Type.Integer(),
  page: Type.Integer(),
  perPage: Type.Integer(),
});