# Routes Documentation

## Overview
Routes organize HTTP endpoints into logical groups based on access control and domain boundaries. They provide middleware hooks and prefix registration for controller groups.

## Architecture Pattern

### Route Group Functions
Routes are organized as async functions that register controller groups:

```typescript
export async function adminRoutes(server: FastifyInstance) {
    server.addHook('preHandler', accessMiddleware);
    server.register(userController, { prefix: "/users" });
    server.register(productController, { prefix: "/products" });
}
```

### Access Control Hooks
Routes apply access control middleware at the group level:
```typescript
server.addHook('preHandler', (req, reply) =>
    accessMiddleware(req, reply, [Role.ADMIN])
);
```

## Route Organization

### Route Groups
Routes are organized by access level and domain:

- **Admin Routes** (`admin-routes.ts`) - Admin-only endpoints
- **Member Routes** (`member-routes.ts`) - Authenticated user endpoints
- **Main Routes** (`routes.ts`) - Public and authenticated routes

### Controller Registration
Controllers are registered with URL prefixes:
```typescript
server.register(userController, { prefix: "/users" });
server.register(productController, { prefix: "/products" });
```

## Access Control Patterns

### Role-Based Access
Routes use role-based access control:
- `Role.ADMIN` - Administrative operations
- `Role.MEMBER` - Authenticated user operations
- No role specified - Public routes

### Middleware Integration
Access middleware is applied as pre-handler hooks:
```typescript
import { accessMiddleware } from "@/middleware/access.middleware";
```

## File Organization

### Route Files
- `routes.ts` - Main route registration and public routes
- `admin-routes.ts` - Admin-only route groups
- `member-routes.ts` - Member-only route groups

### Import Pattern
Routes import controllers and middleware:
```typescript
import { userController } from "@/http/admin/user/user.controller";
import { accessMiddleware } from "@/middleware/access.middleware";
```

## Integration with Main Routes

### Route Registration in Server
Routes are registered in the main routes file:
```typescript
server.register((server) => {
    server.register(authController, { prefix: "/auth" });
    server.register(memberRoutes, { prefix: "/member" });
    server.register(adminRoutes, { prefix: "/admin" });
}, { prefix: "/api/v1" });
```

### Global Middleware
Global middleware like authentication is applied at the server level:
```typescript
server.addHook('preHandler', authMiddleware);
```

## Best Practices
- Group routes by access level and domain
- Apply access control at the route group level
- Use consistent URL prefixes
- Keep route files focused on organization, not logic
- Document access requirements for each route group
- Use TypeScript for all route parameters