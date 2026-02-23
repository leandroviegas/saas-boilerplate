import IORedis from 'ioredis';
import logger from './logger';
import { redisConfig } from '@/config';

export const ioredis = new IORedis({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
    maxRetriesPerRequest: null,
    autoResubscribe: true,
})
    .on('error', (err) => {
        logger.error('Redis error:', err);
    });

export const pubClient = ioredis;
export const subClient = pubClient.duplicate({ enableReadyCheck: false }).on('error', (err) => {
    logger.error('Redis subClient error:', err);
});