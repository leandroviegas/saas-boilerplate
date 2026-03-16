import { Type, Static } from "@sinclair/typebox";

// ============== Role Permission Schemas ==============

export const RolePermissionSchema = Type.Object({
  roleSlug: Type.String({ minLength: 1 }),
  permissions: Type.Record(Type.String(), Type.Array(Type.String())),
});

export type RolePermissionType = Static<typeof RolePermissionSchema>;