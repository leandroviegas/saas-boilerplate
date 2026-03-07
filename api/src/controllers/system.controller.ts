import { Elysia, t } from 'elysia';

export const systemController = new Elysia({
    detail: { tags: ['System'] }
})
    .get('/health', () => ({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    }), {
        response: t.Object({
            status: t.String(),
            timestamp: t.String(),
            uptime: t.Number()
        })
    })
