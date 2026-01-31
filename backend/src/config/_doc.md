# Config Documentation

## Overview
Configuration is centralized in environment-based config objects that provide typed, validated settings for all external services and application parameters.

## Architecture Pattern

### Configuration Objects
Config is organized into domain-specific objects:

```typescript
export const emailConfig = {
    host: process.env.SMTP_HOST || "smtp.example.com",
    // ... other email settings
};
```

### Environment Variables
All configuration uses environment variables with sensible defaults:

```typescript
port: Number(process.env.PORT) || 3000,
```

## Configuration Areas

### Email Configuration (`emailConfig`)
SMTP settings for email sending:

**Properties:**
- `host` - SMTP server hostname
- `port` - SMTP server port (587 default)
- `secure` - Use SSL/TLS
- `user` - SMTP authentication username
- `password` - SMTP authentication password
- `from` - Default sender email address
- `rejectUnauthorized` - SSL certificate validation

### CORS Configuration (`corsConfig`)
Cross-origin resource sharing settings:

**Properties:**
- `origin` - Allowed origins (array from comma-separated env var)
- `methods` - Allowed HTTP methods
- `allowedHeaders` - Permitted request headers
- `exposedHeaders` - Headers exposed to browser
- `credentials` - Allow credentials in CORS

### Server Configuration (`serverConfig`)
Fastify server settings:

**Properties:**
- `port` - Server listening port (3000 default)
- `host` - Server bind address (0.0.0.0 default)
- `protocol` - HTTP protocol (http default)

### Redis Configuration (`redisConfig`)
Redis connection settings:

**Properties:**
- `host` - Redis server hostname (127.0.0.1 default)
- `port` - Redis server port (6379 default)
- `password` - Redis authentication password

### Stripe Configuration (`stripeConfig`)
Payment processing settings:

**Properties:**
- `apiKey` - Stripe secret API key
- `webhookSecret` - Stripe webhook signing secret
- `successUrl` - Checkout success redirect URL
- `cancelUrl` - Checkout cancellation redirect URL

### S3 Configuration (`s3Config`)
Object storage settings:

**Properties:**
- `region` - AWS region
- `accessKeyId` - AWS access key ID
- `secretAccessKey` - AWS secret access key
- `endpoint` - Custom S3 endpoint
- `forcePathStyle` - Path-style S3 URLs
- `bucket` - S3 bucket name

## Usage Patterns

### Plugin Integration
Config objects are imported by plugins:

```typescript
import { redisConfig } from "@/config";

export const ioredis = new IORedis({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
});
```

### Environment Setup
Environment variables are documented for deployment:

```bash
# Server
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Best Practices
- Provide sensible defaults for development
- Use environment variables for all configuration
- Group related settings into objects
- Document required vs optional variables
- Validate configuration at startup
- Use TypeScript types for config objects
- Keep sensitive data in environment variables
- Document environment variable purposes