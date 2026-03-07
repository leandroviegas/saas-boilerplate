import { Elysia, t } from 'elysia';
import { organizationRolePermissionService } from "@/services";
import { Prisma } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth.middleware";

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
        params: t.Object({ roleSlug: t.String() })
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
        })
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
        })
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
        params: t.Object({ roleSlug: t.String() })
    });
