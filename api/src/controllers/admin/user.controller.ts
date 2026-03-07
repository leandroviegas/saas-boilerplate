import { Elysia, t } from 'elysia';
import { userService } from "@/services";
import { UserSchema } from "@/schemas/models/user.schema";
import { paginationSchema } from "@/schemas/pagination";
import { authMiddleware } from "@/middleware/auth.middleware";

export const adminUserController = new Elysia({
    prefix: '/user',
    detail: { tags: ['Admin Users'] }
})

    .use(authMiddleware)


    .get('/', async ({ query }) => {
        const { data, meta } = await userService.findAll(query);

        return {
            code: 'get-users',
            data,
            meta
        };
    }, {
        query: t.Intersect([paginationSchema])
    })


    .get('/:id', async ({ params: { id } }) => {
        const user = await userService.findById(id);

        return { code: 'update-user', data: user };
    }, {
        params: t.Object({ id: t.String() })
    })


    .put('/:id', async ({ params: { id }, body, user: authUser }) => {
        const data = await userService.update(id, body);

        return {
            code: 'update-user',
            data
        };
    }, {
        params: t.Object({ id: t.String() }),
        body: t.Pick(UserSchema, ["email", "name", "image", "username", "preferences"])
    })
    .delete('/:id', async ({ params: { id }, set }) => {
        await userService.delete(id);
        set.status = 204;
        return;
    }, {
        params: t.Object({ id: t.String() })
    });
