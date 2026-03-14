import { Elysia, t } from 'elysia';
import { organizationRolePermissionService } from "@/services";
import { OrganizationRolePermissionsSchema } from "@/schemas/models/organization-role-permission.schema";
import { Prisma } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth.middleware";

const GetRolePermissionsResponse = t.Object({
    code: t.String(),
    data: t.Array(OrganizationRolePermissionsSchema)
});

const GetRolePermissionBySlugResponse = t.Object({
    code: t.String(),
    data: OrganizationRolePermissionsSchema
});

const CreateRolePermissionResponse = t.Object({
    code: t.String(),
    data: OrganizationRolePermissionsSchema
});

const UpdateRolePermissionResponse = t.Object({
    code: t.String(),
    data: OrganizationRolePermissionsSchema
});

const DeleteRolePermissionResponse = t.Object({
    code: t.String(),
    data: OrganizationRolePermissionsSchema
});

export const adminRolePermissionController = new Elysia({
    prefix: '/role-permission',
    detail: { tags: ['Admin Organization Role Permissions'] }
})
    .use(authMiddleware)
    .get('/', async ({ session }) => {
        const organizationId = session?.activeOrganizationId;
        if (!organizationId) throw new Error("Organization not found");

        const data = await organizationRolePermissionService.findByOrganizationId(organizationId);

        return {
            code: "get-organization-role-permissions",
            data,
        };
    }, {
        response: GetRolePermissionsResponse
    })
    .get('/:roleSlug', async ({ params: { roleSlug }, session }) => {
        const organizationId = session?.activeOrganizationId;
        if (!organizationId) throw new Error("Organization not found");

        const data = await organizationRolePermissionService.findById(
            organizationId,
            roleSlug
        );

        return {
            code: "get-organization-role-permissions-by-id",
            data,
        };
    }, {
        params: t.Object({ roleSlug: t.String() }),
        response: GetRolePermissionBySlugResponse
    })
    .post('/', async ({ body, session }) => {
        const organizationId = session?.activeOrganizationId;
        if (!organizationId) throw new Error("Organization not found");
        const { roleSlug, permissions } = body;

        const data = await organizationRolePermissionService.upsert(
            organizationId,
            roleSlug,
            permissions as Prisma.InputJsonValue
        );

        return {
            code: "create-organization-role-permissions",
            data,
        };
    }, {
        body: t.Object({
            roleSlug: t.String(),
            permissions: t.Any(),
        }),
        response: CreateRolePermissionResponse
    })
    .put('/:roleSlug', async ({ params: { roleSlug }, body, session }) => {
        const organizationId = session?.activeOrganizationId;
        if (!organizationId) throw new Error("Organization not found");
        const { permissions } = body;

        const data = await organizationRolePermissionService.update(
            organizationId,
            roleSlug,
            { permissions: permissions as Prisma.InputJsonValue }
        );

        return {
            code: "update-organization-role-permissions",
            data,
        };
    }, {
        params: t.Object({ roleSlug: t.String() }),
        body: t.Object({
            permissions: t.Any(),
        }),
        response: UpdateRolePermissionResponse
    })
    .delete('/:roleSlug', async ({ params: { roleSlug }, session }) => {
        const organizationId = session?.activeOrganizationId;
        if (!organizationId) throw new Error("Organization not found");

        const data = await organizationRolePermissionService.delete(
            organizationId,
            roleSlug
        );

        return {
            code: "delete-organization-role-permissions",
            data,
        };
    }, {
        params: t.Object({ roleSlug: t.String() }),
        response: DeleteRolePermissionResponse
    });
