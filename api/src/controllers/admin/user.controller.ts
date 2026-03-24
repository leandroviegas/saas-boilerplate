import { Elysia, t, Static } from 'elysia';
import { userService } from "@/services";
import { UserSchema } from "@/schemas/models/user.schema";
import { paginationSchema, metaSchema } from "@/schemas/pagination";
import { authMiddleware } from "@/middleware/auth.middleware";

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

export const UpdateUserBodySchema = t.Object({
    email: t.String({ format: "email" }),
    name: t.String(),
    username: t.String(),
    image: t.Optional(t.Union([t.String(), t.Null()])),
    preferences: t.Optional(t.Union([t.String(), t.Null()])),
});

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
