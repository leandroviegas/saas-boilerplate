import { languageEnum } from "./enums/language-enum";

export const serverConfig = {
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || "0.0.0.0",
    protocol: process.env.PROTOCOL || "http"
};

export const serverUrl = (() => {
    const url = new URL(`${serverConfig.protocol}://${serverConfig.host}`);

    if (serverConfig.port) {
        url.port = serverConfig.port.toString();
    }

    return url.href.replace(/\/$/, "");
})();

export const webUrl = (() => {
    return (process.env.WEB_URL || "http://localhost:8080").replace(/\/$/, "");
})();

export const websocketsConfig = {
    port: Number(process.env.WSPORT) || 3001,
    host: process.env.WSHOST || "0.0.0.0",
    protocol: process.env.WSPROTOCOL || "ws"
};

export const redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || ""
};

export const corsConfig = {
    origin: [...(process.env.CORS_ORIGINS?.split(',') ?? []), webUrl],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'set-cookie', 'set-auth-jwt'],
    exposedHeaders: ['set-cookie', 'set-auth-jwt'],
    credentials: true,
};

export const betterAuthConfig = {
    secret: process.env.BETTER_AUTH_SECRET!,
    url: `${serverUrl}/auth`
}

export const publicConfig = {
    defaultLang: languageEnum.PT
}