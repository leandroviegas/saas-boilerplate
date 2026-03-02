import { Type, Static } from "@sinclair/typebox";
import { multiSchemaBuilder } from "@/schemas/schemas";
import { OrganizationRolePermissionsSchema } from "@/schemas/models/organization-role-permission.schema";

export type OrganizationRolePermissionsType = Static<typeof OrganizationRolePermissionsSchema>;

const CreateOrganizationRolePermissionsBody = Type.Object({
  roleSlug: Type.String(),
  permissions: Type.Unknown(),
});

const UpdateOrganizationRolePermissionsBody = Type.Object({
  permissions: Type.Unknown(),
});

export const routesSchema = multiSchemaBuilder({
  getAllOrganizationRolePermissions: {
    tags: ["Organization Role Permissions"],
    response: {
      200: {
        data: Type.Array(OrganizationRolePermissionsSchema),
      },
    },
  },

  getOrganizationRolePermissionsById: {
    tags: ["Organization Role Permissions"],
    params: Type.Object({
      roleSlug: Type.String(),
    }),
    response: {
      200: {
        data: OrganizationRolePermissionsSchema,
      },
    },
  },

  createOrganizationRolePermissions: {
    tags: ["Organization Role Permissions"],
    body: CreateOrganizationRolePermissionsBody,
    response: {
      201: {
        data: OrganizationRolePermissionsSchema,
      },
    },
  },

  updateOrganizationRolePermissions: {
    tags: ["Organization Role Permissions"],
    params: Type.Object({
      roleSlug: Type.String(),
    }),
    body: UpdateOrganizationRolePermissionsBody,
    response: {
      200: {
        data: OrganizationRolePermissionsSchema,
      },
    },
  },

  deleteOrganizationRolePermissions: {
    tags: ["Organization Role Permissions"],
    params: Type.Object({
      roleSlug: Type.String(),
    }),
    response: {
      200: {
        data: OrganizationRolePermissionsSchema,
      },
    },
  },
});

export type CreateOrganizationRolePermissionsBodyType = Static<typeof routesSchema.createOrganizationRolePermissions.body>;
export type UpdateOrganizationRolePermissionsBodyType = Static<typeof routesSchema.updateOrganizationRolePermissions.body>;
