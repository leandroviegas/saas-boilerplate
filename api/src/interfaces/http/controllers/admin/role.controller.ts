import { Elysia, t } from 'elysia';
import { roleService } from "@/application";
import { RoleSchema } from "@/interfaces/http/schemas/models/role.schema";
import { authMiddleware } from '@/interfaces/http/middleware/auth.middleware';
import { metaSchema, paginationSchema } from '@/interfaces/http/schemas/pagination';

const GetRolesResponse = t.Object({
    code: t.String(),
    data: t.Array(RoleSchema),
    meta: metaSchema
});

const GetRoleResponse = t.Object({
    code: t.String(),
    data: RoleSchema
});

const CreateRoleResponse = t.Object({
    code: t.String(),
    data: RoleSchema
});

const UpdateRoleResponse = t.Object({
    code: t.String(),
    data: RoleSchema
});

const DeleteRoleResponse = t.Object({
    code: t.String(),
    data: RoleSchema
});

export const adminRoleController = new Elysia({
    prefix: '/role',
    detail: { tags: ['Admin Roles'] }
})
    .use(authMiddleware)
    .get('/', async ({ query }) => {
        const { data, meta } = await roleService.findAll(query);

        return {
            code: 'get-roles',
            data,
            meta
        };
    }, {
        query: t.Intersect([paginationSchema]),
        response: GetRolesResponse
    })


    .get('/:slug', async ({ params: { slug } }) => {
        const data = await roleService.findById(slug);

        return {
            code: 'get-role',
            data
        };
    }, {
        params: t.Object({ slug: t.String() }),
        response: GetRoleResponse
    })


    .post('/', async ({ body }) => {
        const data = await roleService.create(body);

        return {
            code: 'create-role',
            data
        };
    }, {
        body: t.Omit(RoleSchema, ["createdAt", "updatedAt"]),
        response: CreateRoleResponse
    })

    
    .put('/:slug', async ({ params: { slug }, body }) => {
        const data = await roleService.update(slug, body);

        return {
            code: 'update-role',
            data
        };
    }, {
        params: t.Object({ slug: t.String() }),
        body: t.Partial(t.Omit(RoleSchema, ["createdAt", "updatedAt"])),
        response: UpdateRoleResponse
    })


    .delete('/:slug', async ({ params: { slug } }) => {
        const data = await roleService.delete(slug);

        return {
            code: 'delete-role',
            data
        };
    }, {
        params: t.Object({ slug: t.String() }),
        response: DeleteRoleResponse
    });
