import { Type, Static } from "@sinclair/typebox";

export const RoleSchema = Type.Object({
  slug: Type.String({ minLength: 2, maxLength: 50 }),
  privilege: Type.Integer({ default: 20, minimum: 0, maximum: 100 }),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export type RoleType = Static<typeof RoleSchema>;
