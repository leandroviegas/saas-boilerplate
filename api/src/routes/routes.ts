import { FastifyInstance } from 'fastify';
import { authController } from '../http/auth/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { memberRoutes } from './member-routes';
import { adminRoutes } from './admin-routes';
import { webhookController } from '../http/webhook/webhook.controller';
import { Type } from '@sinclair/typebox';
import swaggerUi from '@fastify/swagger-ui'

export async function routes(server: FastifyInstance) {
    server.addHook('preHandler', authMiddleware);

    await server.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        }
    });

    server.get('/health', {
        schema: {
            response: {
                200: Type.Object({
                    status: Type.String(),
                    timestamp: Type.String(),
                    uptime: Type.Number()
                })
            }
        }
    }, async () => {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        };
    });


    server.register((server) => {
        server.register(authController, { prefix: "/auth" });
        server.register(memberRoutes, { prefix: "/member" });
        server.register(adminRoutes, { prefix: "/admin" });
        server.register(webhookController, { prefix: "/webhooks" });
    }, { prefix: "/" });
}
