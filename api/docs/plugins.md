# Plugins Documentation

## Overview
Plugins encapsulate external service integrations and infrastructure components. They provide configured instances of databases, caches, logging systems, and real-time communication services.

## Architecture Pattern

### Plugin Exports
Plugins export configured service instances:

```typescript
export const prisma = prismaBase.$extends(paginationExtension);
export default logger;
export const ioredis = new IORedis({ /* config */ });
```

### Fastify Integration
Some plugins integrate directly with Fastify:

```typescript
export const socketio = (io: SocketIOServer, fastify: FastifyInstance) => {
    // socket.io setup and event handling
}
```

## Core Plugins

### Database Plugin (`prisma.ts`)
Provides Prisma ORM with PostgreSQL adapter and pagination extension:

**Features:**
- PostgreSQL connection via Pg adapter
- Custom pagination extension for all models
- Extended Prisma client with query helpers

**Usage:**
```typescript
import { prisma } from "@/plugins/prisma";
const users = await prisma.user.paginate({}, { page: 1, perPage: 10 });
```

### Logging Plugin (`logger.ts`)
Winston-based logging with file rotation and console output:

**Features:**
- Multiple log levels (error, warn, info, debug)
- Daily rotating file logs
- Console output with colors
- JSON format for files, human-readable for console

**Log Files:**
```
logs/YYYY-MM-DD/
├── error.log
├── warn.log
├── info.log
├── debug.log
└── combined.log
```

### Redis Plugin (`ioredis.ts`)
Redis client for caching and pub/sub:

**Features:**
- Connection pooling and error handling
- Separate pub/sub clients for Socket.IO
- Automatic reconnection

**Usage:**
```typescript
import { ioredis } from "@/plugins/ioredis";
await ioredis.set('key', 'value');
```

### Socket.IO Plugin (`socketio.ts`)
Real-time communication with Redis adapter:

**Features:**
- Redis-backed pub/sub for scaling
- Authentication-based room joining
- Event broadcasting to users/sessions
- Automatic disconnection on session revocation

**Room Structure:**
- `user-{userId}` - User-specific events
- `session-{sessionId}` - Session-specific events

## Plugin Registration

### Server Integration
Plugins are registered in the main server file:

```typescript
import prismaPlugin from "@/plugins/prisma";
// ... other imports

await fastify.register(prismaPlugin);
```

## Configuration

### Environment-Based Config
Plugins use configuration from environment variables:

```typescript
import { redisConfig } from "@/config";

export const ioredis = new IORedis({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
});
```

## Error Handling

### Plugin-Level Error Handling
Plugins include error handling for connection issues:

```typescript
ioredis.on('error', (err) => {
    logger.error('Redis error:', err);
});
```

## Best Practices
- Export singleton instances for consistency
- Include comprehensive error handling
- Use environment-based configuration
- Document plugin dependencies and setup
- Implement connection health checks
- Use appropriate log levels for different events
- Keep plugins focused on infrastructure concerns