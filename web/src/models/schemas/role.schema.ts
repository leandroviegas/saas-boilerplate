import { Type, Static } from "@sinclair/typebox";

// ============== Role Schemas ==============

export const RoleSchema = Type.Object({
  slug: Type.String({ minLength: 2, maxLength: 50 }),
  privilege: Type.Integer({ minimum: 0, maximum: 100 }),
});

export type RoleType = Static<typeof RoleSchema>;