import { Type, Static } from "@sinclair/typebox";

export const OrganizationRolePermissionsSchema = Type.Object({
  organizationId: Type.String(),
  roleSlug: Type.String(),
  permissions: Type.Unknown(),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export type OrganizationRolePermissionsType = Static<typeof OrganizationRolePermissionsSchema>;
