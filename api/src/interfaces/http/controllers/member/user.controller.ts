import { Elysia } from 'elysia';
import { authMiddleware } from "@/interfaces/http/middleware/auth.middleware";

export const memberUserController = new Elysia({
    prefix: '/user',
    detail: { tags: ['Member Users'] }
})
    .use(authMiddleware)
    .get('/me', async ({ user }) => {
        if (!user) throw new Error("Unauthorized");
        return {
            code: 'update-user',
            data: user
        };
    }, {
    });
