import { Elysia, t, Static } from 'elysia';
import { userService } from "@/application";
import { UserSchema } from "@/interfaces/http/schemas/models/user.schema";
import { paginationSchema, metaSchema } from "@/interfaces/http/schemas/pagination";
import { authMiddleware } from "@/interfaces/http/middleware/auth.middleware";

const GetUsersResponse = t.Object({
    code: t.String(),
    data: t.Array(UserSchema),
    meta: metaSchema
});

const GetUserResponse = t.Object({
    code: t.String(),
    data: UserSchema
});

const UpdateUserResponse = t.Object({
    code: t.String(),
    data: UserSchema
});

export const UpdateUserBodySchema = t.Pick(UserSchema, ['email', 'name', 'username', 'image', 'preferences']);

export type UpdateUserBodyType = typeof UpdateUserBodySchema.static;

export type UpdateUserResponseType = Static<typeof UpdateUserResponse>;

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
        query: t.Intersect([paginationSchema]),
        response: GetUsersResponse
    })


    .get('/:id', async ({ params: { id } }) => {
        const user = await userService.findById(id);

        return { code: 'get-user', data: user };
    }, {
        params: t.Object({ id: t.String() }),
        response: GetUserResponse
    })


    .put('/:id', async ({ params: { id }, body, user: authUser }) => {
        const data = await userService.update(id, body);

        return {
            code: 'update-user',
            data
        };
    }, {
        params: t.Object({ id: t.String() }),
        body: UpdateUserBodySchema,
        response: UpdateUserResponse
    })

    
    .delete('/:id', async ({ params: { id }, set }) => {
        await userService.delete(id);
        set.status = 204;
        return;
    }, {
        params: t.Object({ id: t.String() })
    });
