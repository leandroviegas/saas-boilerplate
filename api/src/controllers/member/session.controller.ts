import { Elysia, t } from 'elysia';
import { sessionService } from "@/services";
import { authMiddleware } from "@/middleware/auth.middleware";

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
    })
    .delete('/:id', async ({ params: { id }, user }) => {
        if (!user) throw new Error("Unauthorized");
        await sessionService.revoke(id, user.id);

        return {
            code: 'session-revoked'
        };
    }, {
        params: t.Object({ id: t.String() })
    });
