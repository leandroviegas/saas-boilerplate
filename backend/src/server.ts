import Fastify from 'fastify';
import swagger from '@fastify/swagger'
import corsPlugins from '@fastify/cors';
import cookie from '@fastify/cookie';
import fastifyRawBody from 'fastify-raw-body';
import { routes } from './routes/routes';
import { errorHandler } from './handlers/error.handler';
import { responseMessageHandler } from './handlers/response-message.hander';
import { mainMiddleware } from './middleware/main.middleware';
import { Server as SocketIOServer } from 'socket.io';
import { socketio } from './plugins/socketio';
import { corsConfig, serverConfig } from './config';
import logger from './plugins/logger';
import ajvErrors from "ajv-errors/dist";

const server = Fastify({
  // http2: true,
  // https: {
  //   key: fs.readFileSync(path.join(__dirname, 'path/to/your/server.key')),
  //   cert: fs.readFileSync(path.join(__dirname, 'path/to/your/server.cert'))
  // },
  disableRequestLogging: true,
  logger: {
    level: 'info',
    stream: {
      write: (msg) => logger.info(msg.trim()),
    },
  },
  ajv: {
    customOptions: {
      allErrors: true,
    },
    plugins: [ajvErrors],
  },
  connectionTimeout: 20000,
  keepAliveTimeout: 30000,
  bodyLimit: 52428800,
  trustProxy: true,
})

async function main() {
  await server.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: `${process.env.APP_NAME} API`,
        description: `${process.env.APP_DESCRIPTION || ""}`,
        version: '1.0.0'
      },
      servers: [
        {
          url: `${serverConfig.protocol}://${serverConfig.host}:${serverConfig.port}`,
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  });

  server.setErrorHandler(errorHandler);

  server.register(cookie);

  server.register(corsPlugins, corsConfig);

  server.addHook('onRequest', mainMiddleware);

  await server.register(fastifyRawBody, {
    field: 'rawBody',
    global: false,
    encoding: 'utf8',
    runFirst: true,
  });

  await server.register(routes);

  server.addHook('onSend', responseMessageHandler);

  server.addHook('onResponse', (request, reply, done) => {
    const { method, url, ip, headers } = request;
    const { statusCode } = reply;
    const userAgent = headers['user-agent'];
    const userId = request.user?.id;
    const sessionId = request.session?.id;
    const responseTime = Number(reply.elapsedTime.toFixed(2));

    logger.info(JSON.stringify({
      msg: `${method} ${url} ${statusCode} - ${responseTime}ms`,
      method,
      url,
      statusCode,
      ip,
      userId,
      sessionId,
      userAgent,
      responseTime
    }));
    done();
  });

  await server.ready()

  server.swagger()

  const io = new SocketIOServer(server.server, { cors: corsConfig, path: '/ws' })

  socketio(io, server)

  server.log.info(`Swagger docs at ${serverConfig.protocol}://${serverConfig.host}:${serverConfig.port}/docs`);
  await server.listen({ port: serverConfig.port, host: serverConfig.host });
}

main().catch(err => {
  console.error('Server failed to start:', err)
  process.exit(1)
})
