import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import logger from './plugins/logger';
import { controllers } from './routes';
import { serverConfig, corsConfig, websocketsConfig } from './config';
import { mainMiddleware } from './middleware/main.middleware';
import { processError } from './handlers/error.handler';
import { errorSchema } from './schemas';
import { languageEnum } from './enums/language-enum';
import { Server as SocketIOServer } from 'socket.io';
import { socketio } from './plugins/socketio';
import { createServer } from 'http';

let app = new Elysia({ adapter: node() })
    .use(mainMiddleware)
    .onError(async ({ error, set, lang }) => {
        const language = (lang as languageEnum) ?? languageEnum.EN;

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
    .use(controllers)
    .listen(serverConfig.port);

const ioServer = createServer();
const io = new SocketIOServer(ioServer, { cors: corsConfig, path: '/ws' });
socketio(io);
ioServer.listen(websocketsConfig.port);

logger.info(`Elysia is running at port ${serverConfig.port}`);
logger.info(`Websockets is running at port ${websocketsConfig.port}`);
