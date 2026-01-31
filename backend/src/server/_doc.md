# Server Documentation

## Overview
The server is built with Fastify and orchestrates all application components including routing, middleware, plugins, real-time communication, and error handling.

## Architecture Pattern

### Fastify Server Instance
Server is created with comprehensive configuration:

```typescript
const server = Fastify({
    disableRequestLogging: true,
    logger: { /* custom logger */ },
    ajv: { /* validation config */ },
    // ... other settings
});
```

### Async Main Function
Server startup is handled in an async main function with proper error handling.

## Core Components

### Plugin Registration
Essential plugins are registered in order:

1. **Swagger** - API documentation generation
2. **Cookie** - HTTP cookie parsing
3. **CORS** - Cross-origin resource sharing
4. **Raw Body** - Raw request body access for webhooks

### Middleware Hooks
Global hooks are applied for cross-cutting concerns:

- `onRequest` - Language detection and preprocessing
- `onSend` - Response message internationalization
- `onResponse` - Request logging and monitoring

### Route Registration
Main routes are registered with API versioning:

```typescript
await server.register(routes);
```

### Real-Time Communication
Socket.IO is integrated for WebSocket support:

```typescript
const io = new SocketIOServer(server.server, { cors: corsConfig, path: '/ws' });
socketio(io, server);
```

## Configuration

### Server Settings
Fastify is configured with production-ready settings:

- **Connection Timeout**: 20 seconds
- **Keep Alive Timeout**: 30 seconds
- **Body Limit**: 50MB (for file uploads)
- **Trust Proxy**: Enabled for load balancers

### Validation Configuration
AJV is configured for comprehensive validation:

```typescript
ajv: {
    customOptions: {
        allErrors: true,
    },
    plugins: [ajvErrors],
}
```

## Error Handling

### Global Error Handler
Centralized error handling for all routes:

```typescript
server.setErrorHandler(errorHandler);
```

### Startup Error Handling
Main function includes error handling for startup failures:

```typescript
main().catch(err => {
    console.error('Server failed to start:', err);
    process.exit(1);
});
```

## Logging and Monitoring

### Request Logging
All requests are logged with detailed information:

```typescript
logger.info(JSON.stringify({
    msg: `${method} ${url} ${statusCode} - ${responseTime}ms`,
    method, url, statusCode, ip, userId, sessionId, userAgent, responseTime
}));
```

### Custom Logger Integration
Winston logger is integrated with Fastify's logging system.

## API Documentation

### Swagger/OpenAPI
Automatic API documentation generation:

```typescript
await server.register(swagger, {
    openapi: {
        // OpenAPI 3.0 specification
    }
});
```

### Documentation Access
Docs are available at `/docs` endpoint with UI.

## Startup Process

### Initialization Order
1. Create Fastify server instance
2. Register Swagger plugin
3. Set error handler
4. Register utility plugins (cookie, CORS, raw body)
5. Apply global middleware hooks
6. Register routes
7. Apply response hooks
8. Wait for server ready state
9. Generate Swagger docs
10. Initialize Socket.IO
11. Start listening on configured port

## Best Practices
- Use comprehensive server configuration for production
- Implement proper error handling and logging
- Configure timeouts and limits appropriately
- Enable CORS with specific origins
- Use middleware hooks for cross-cutting concerns
- Integrate real-time communication when needed
- Generate and maintain API documentation
- Monitor requests and responses for debugging
- Handle startup failures gracefully