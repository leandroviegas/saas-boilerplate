import { Type, Static } from "@sinclair/typebox";

// ============== Organization Schemas ==============

export const OrganizationSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  slug: Type.String({ minLength: 1 }),
});

export type OrganizationType = Static<typeof OrganizationSchema>;