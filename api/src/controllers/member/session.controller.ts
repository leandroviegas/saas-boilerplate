import { Elysia, t } from 'elysia';
import { sessionService } from "@/services";
import { SessionSchema } from "@/schemas/models/session.schema";
import { authMiddleware } from "@/middleware/auth.middleware";

const GetSessionsResponse = t.Object({
    code: t.String(),
    data: t.Array(SessionSchema)
});

const RevokeSessionResponse = t.Object({
    code: t.String()
});

export const memberSessionController = new Elysia({
    prefix: '/session',
    detail: { tags: ['Member Sessions'] }
})
    .use(authMiddleware)
    .get('/', async ({ user }) => {
        if (!user) throw new Error("Unauthorized");
        const sessions = await sessionService.findAllByUserId(user.id);

        return {
            code: 'get-sessions',
            data: sessions
        };
    }, {
        response: GetSessionsResponse
    })
    .delete('/:id', async ({ params: { id }, user }) => {
        if (!user) throw new Error("Unauthorized");
        await sessionService.revoke(id, user.id);

        return {
            code: 'session-revoked'
        };
    }, {
        params: t.Object({ id: t.String() }),
        response: RevokeSessionResponse
    });
