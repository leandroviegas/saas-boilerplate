import { Elysia, t } from 'elysia';
import { roleService } from "@/services";
import { RoleSchema } from "@/schemas/models/role.schema";

export const adminRoleController = new Elysia({
    prefix: '/role',
    detail: { tags: ['Admin Roles'] }
})
    .get('/', async () => {
        const data = await roleService.findAll();

        return {
            code: 'get-roles',
            data
        };
    }, {
    })
    .get('/:slug', async ({ params: { slug } }) => {
        const data = await roleService.findById(slug);

        return {
            code: 'get-role',
            data
        };
    }, {
        params: t.Object({ slug: t.String() })
    })
    .post('/', async ({ body }) => {
        const data = await roleService.create(body);

        return {
            code: 'create-role',
            data
        };
    }, {
        body: t.Omit(RoleSchema, ["createdAt", "updatedAt"])
    })
    .put('/:slug', async ({ params: { slug }, body }) => {
        const data = await roleService.update(slug, body);

        return {
            code: 'update-role',
            data
        };
    }, {
        params: t.Object({ slug: t.String() }),
        body: t.Partial(t.Omit(RoleSchema, ["createdAt", "updatedAt"]))
    })
    .delete('/:slug', async ({ params: { slug } }) => {
        const data = await roleService.delete(slug);

        return {
            code: 'delete-role',
            data
        };
    }, {
        params: t.Object({ slug: t.String() })
    });
