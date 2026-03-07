import { t, Static } from "elysia";

export const paginationSchema = t.Object({
  page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
  perPage: t.Optional(t.Numeric({ default: 20, minimum: 1 })),
  search: t.Optional(t.String({ default: "" })),
});

export type PaginationType = Static<typeof paginationSchema>;

export const metaSchema = t.Object({
  total: t.Integer(),
  page: t.Integer(),
  perPage: t.Integer(),
});
