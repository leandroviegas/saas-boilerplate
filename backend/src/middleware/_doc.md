# Middleware Documentation

## Overview
Middleware functions intercept and process HTTP requests before they reach route handlers. They handle cross-cutting concerns like authentication, authorization, and request preprocessing.

## Architecture Pattern

### Fastify Middleware Functions
Middleware functions follow Fastify's hook pattern:

```typescript
export async function middlewareName(request: FastifyRequest, reply: FastifyReply) {
    // middleware logic
}
```

### Request Augmentation
Middleware can add properties to the request object:

```typescript
declare module 'fastify' {
    interface FastifyRequest {
        user?: AuthUser;
        session?: AuthSession;
        lang?: string;
    }
}
```

## Core Middleware Types

### Authentication Middleware (`auth.middleware.ts`)
Handles user authentication and session validation:
- Extracts session data from headers
- Populates `request.user` and `request.session`
- Allows unauthenticated requests to pass through

### Access Control Middleware (`access.middleware.ts`)
Enforces role-based access control:
```typescript
export async function accessMiddleware(
    request: FastifyRequest,
    reply: FastifyReply,
    roles: string[]
) {
    if (!request.user?.role || !roles.includes(request.user.role)) {
        return reply.status(403).send({ code: "UNAUTHORIZED" });
    }
}
```

### Main Middleware (`main.middleware.ts`)
Handles request preprocessing:
- Language detection from headers/cookies
- Sets `request.lang` for internationalization

## Usage Patterns

### Global Application
Middleware is applied at different levels:

**Server Level (Global):**
```typescript
server.addHook('preHandler', authMiddleware);
server.addHook('preHandler', mainMiddleware);
```

**Route Group Level:**
```typescript
server.addHook('preHandler', (req, reply) =>
    accessMiddleware(req, reply, [Role.ADMIN])
);
```

## Middleware Order

### Execution Sequence
Middleware executes in registration order:
1. `mainMiddleware` - Language detection
2. `authMiddleware` - Authentication
3. `accessMiddleware` - Authorization (route-specific)

## Error Handling

### Early Returns
Middleware can short-circuit request processing:
```typescript
if (!authorized) {
    return reply.status(403).send({ code: "UNAUTHORIZED" });
}
```

### Async Operations
All middleware functions are async and can perform database operations.

## Integration with Routes

### Route-Specific Middleware
Applied at route group level for access control:
```typescript
export async function adminRoutes(server: FastifyInstance) {
    server.addHook('preHandler', (req, reply) =>
        accessMiddleware(req, reply, [Role.ADMIN])
    );
    // route registrations...
}
```

## Best Practices
- Keep middleware focused on single responsibilities
- Use TypeScript declarations for request augmentation
- Handle errors appropriately (return vs throw)
- Apply middleware at the correct level (global vs route-specific)
- Document middleware dependencies and order
- Test middleware in isolation
- Use early returns for unauthorized access