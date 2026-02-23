# HTTP Layer Documentation

## Overview
The HTTP layer handles incoming requests, validates data, orchestrates business logic through services, and returns structured responses. Controllers follow a consistent pattern using Fastify framework with TypeScript for type safety.

## Architecture Pattern

### Controller Function Pattern
Controllers are exported as async functions that register routes on a Fastify instance:

```typescript
export async function userController(fastify: FastifyInstance) {
    // route definitions...
}
```

### Route Registration
Routes are registered with HTTP method, path, schema validation, and handler:

```typescript
fastify.get(
    "/",
    {
        schema: routesSchema.getAllUsers
    },
    async (request: FastifyRequest<{ Querystring: GetAllUsersQueryType }>, reply: FastifyReply) => {
        // handler logic...
    }
);
```

## Request/Response Patterns

### Request Types
Requests are strongly typed using generics:
- `Params` - URL parameters (:id)
- `Querystring` - Query parameters (?page=1&perPage=10)
- `Body` - Request body data

### Response Structure
All responses follow a consistent JSON structure:
```json
{
    "code": "operation-code",
    "data": { /* response data */ },
    "meta": { /* pagination metadata */ }
}
```

### HTTP Status Codes
- `200` - Successful operations with data
- `201` - Resource created
- `204` - Successful operation with no content (DELETE)
- `400` - Validation errors
- `401` - Authentication required
- `403` - Authorization failed
- `404` - Resource not found
- `500` - Internal server error

## Schema Integration

### Route Schemas
Each route references schemas from companion `.schemas.ts` files:
```typescript
import { routesSchema, UpdateUserBodyType } from "./user.schemas";
```

### Type Safety
TypeScript types are extracted from schemas for compile-time safety:
```typescript
async (request: FastifyRequest<{ Body: UpdateUserBodyType }>, reply: FastifyReply)
```

## Service Integration

### Dependency Injection
Controllers import and use service instances:
```typescript
import { userService } from "@/services/user.service";
```

### Business Logic Delegation
Controllers delegate to services for business logic:
```typescript
const data = await userService.update(id, request.body);
```

## File Organization

### Directory Structure
```
http/
├── admin/          # Admin-only endpoints
│   └── user/
│       ├── user.controller.ts
│       └── user.schemas.ts
├── member/         # Authenticated user endpoints
│   └── session/
│       ├── session.controller.ts
│       └── session.schemas.ts
├── auth/           # Authentication endpoints
├── webhook/        # Webhook handlers
└── _doc.txt
```

### Naming Conventions
- Controllers: `{resource}.controller.ts`
- Schemas: `{resource}.schemas.ts`
- Route functions: `{resource}Controller`

## Special Controllers

### Auth Controller
Handles authentication flows, often delegating to external auth libraries (like NextAuth.js).

### Webhook Controller
Processes external service webhooks with minimal validation, focusing on security and data integrity.

## Best Practices
- Keep controllers thin - delegate business logic to services
- Use schema validation for all inputs
- Return consistent response structures
- Handle errors through Fastify's error handling system
- Document routes with OpenAPI tags
- Use TypeScript generics for type safety
- Validate user permissions in controllers when needed
