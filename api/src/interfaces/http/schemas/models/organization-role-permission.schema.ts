import { t, Static } from "elysia";

export const OrganizationRolePermissionsSchema = t.Object({
  organizationId: t.String(),
  roleSlug: t.String(),
  permissions: t.Unknown(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type OrganizationRolePermissionsType = Static<typeof OrganizationRolePermissionsSchema>;