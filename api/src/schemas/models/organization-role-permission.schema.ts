import { t } from "elysia";

export const OrganizationRolePermissionsSchema = t.Object({
  organizationId: t.String(),
  roleSlug: t.String(),
  permissions: t.Unknown(),
  createdAt: t.String({ format: "date-time" }),
  updatedAt: t.String({ format: "date-time" }),
});