import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import logger from '@/infrastructure/logger/logger';
import { routes } from './routes';
import { serverConfig, corsConfig, websocketsConfig } from '@/infrastructure/config/env';
import { mainMiddleware } from './middleware/main.middleware';
import { processError } from '@/core/errors/error.handler';
import { errorSchema } from './schemas';
import { languageEnum } from '@/core/constants/language.enum';
import { Server as SocketIOServer } from 'socket.io';
import { socketio } from '@/infrastructure/websocket/socketio';
import { createServer } from 'http';
import { seed } from '@/infrastructure/database/prisma/seed';

seed();

let app = new Elysia({ adapter: node() })
    .use(mainMiddleware)
    .onError(async ({ error, set, lang }) => {
        const language = lang ?? languageEnum.EN;

        const { status, response } = await processError(error, language);

        set.status = status;
        return response;
    })
    .model({
        ErrorResponse: errorSchema,
    })
    .guard({
        as: 'global',
        response: {
            400: 'ErrorResponse'
        }
    })
    .use(cors(corsConfig))
    .use(swagger({
        path: '/docs',
        documentation: {
            info: {
                title: `${process.env.APP_NAME}`,
                version: '1.0.0'
            }
        }
    }))
    .use(routes)
    .listen(serverConfig.port);

const ioServer = createServer();
const io = new SocketIOServer(ioServer, { cors: corsConfig, path: '/ws' });
socketio(io);
ioServer.listen(websocketsConfig.port);

logger.info(`Elysia is running at port ${serverConfig.port}`);
logger.info(`Websockets is running at port ${websocketsConfig.port}`);
