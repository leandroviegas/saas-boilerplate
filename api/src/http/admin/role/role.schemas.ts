import { Type, Static } from "@sinclair/typebox";
import { RoleSchema } from "@/schemas/models/role.schema";
import { multiSchemaBuilder } from "@/schemas/schemas";

export const routesSchema = multiSchemaBuilder({
  getAllRoles: {
    tags: ["Roles"],
    response: {
      200: {
        data: Type.Array(RoleSchema),
      },
    },
  },

  getRoleBySlug: {
    tags: ["Roles"],
    params: Type.Object({
      slug: Type.String(),
    }),
    response: {
      200: {
        data: RoleSchema,
      },
    },
  },

  createRole: {
    tags: ["Roles"],
    body: Type.Omit(RoleSchema, ["createdAt", "updatedAt"]),
    response: {
      201: {
        data: RoleSchema,
      },
    },
  },

  updateRole: {
    tags: ["Roles"],
    params: Type.Object({
      slug: Type.String(),
    }),
    body: Type.Partial(Type.Omit(RoleSchema, ["createdAt", "updatedAt"])),
    response: {
      200: {
        data: RoleSchema,
      },
    },
  },

  deleteRole: {
    tags: ["Roles"],
    params: Type.Object({
      slug: Type.String(),
    }),
    response: {
      200: {
        data: RoleSchema,
      },
    },
  },
});

export type CreateRoleBodyType = Static<typeof routesSchema.createRole.body>;
export type UpdateRoleBodyType = Static<typeof routesSchema.updateRole.body>;
