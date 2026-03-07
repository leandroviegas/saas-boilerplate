import { t } from "elysia";

export const RoleSchema = t.Object({
  slug: t.String({ minLength: 2, maxLength: 50 }),
  privilege: t.Integer({ default: 20, minimum: 0, maximum: 100 }),
  createdAt: t.String({ format: "date-time" }),
  updatedAt: t.String({ format: "date-time" }),
});