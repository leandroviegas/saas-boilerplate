import { languageEnum } from "./enums/language-enum";

export const emailConfig = {
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true" || false,
    user: process.env.SMTP_USER || "",
    password: process.env.SMTP_PASSWORD || "",
    from: process.env.SMTP_FROM || "noreply@example.com",
    rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== "false",
};

export const corsConfig = {
    origin: process.env.CORS_ORIGINS?.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'set-cookie', 'set-auth-jwt'],
    exposedHeaders: ['set-cookie', 'set-auth-jwt'],
    credentials: true,
};

export const serverConfig = {
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || "0.0.0.0",
    protocol: process.env.PROTOCOL || "http"
};

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

export const stripeConfig = {
    apiKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    successUrl: process.env.STRIPE_SUCCESS_URL || "http://localhost:8080/dashboard/billing?success=true",
    cancelUrl: process.env.STRIPE_CANCEL_URL || "http://localhost:8080/dashboard/billing?canceled=true",
};

export const s3Config = {
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: Boolean(process.env.S3_FORCE_PATH_STYLE),
    bucket: process.env.S3_BUCKET_NAME!,
};

export const publicConfig = {
    defaultLang: languageEnum.PT
}