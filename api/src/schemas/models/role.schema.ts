import { t, Static } from "elysia";

export const RoleSchema = t.Object({
  slug: t.String({ minLength: 2, maxLength: 50 }),
  privilege: t.Numeric(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type RoleType = Static<typeof RoleSchema>;