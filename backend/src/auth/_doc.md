# Auth Documentation

## Overview
Authentication and authorization are handled by Better Auth, a comprehensive auth library. The auth configuration includes user management, sessions, two-factor authentication, and role-based access control.

## Architecture Pattern

### Better Auth Configuration
Auth is configured as a singleton instance with comprehensive settings:

```typescript
export const auth = betterAuth({
    // configuration object
});
```

### Type Exports
TypeScript types are inferred from the auth configuration:

```typescript
export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthSession = typeof auth.$Infer.Session.session;
```

## Core Features

### Authentication Methods
- Email and password authentication
- JWT token support
- Two-factor authentication (2FA)
- Multi-session support
- Username validation

### User Management
Extended user model with additional fields:
- Role-based permissions
- Username (optional)
- User preferences
- 2FA status

### Session Management
- 30-day session expiration
- Multi-session support
- Session-based notifications

## Access Control

### Role-Based Permissions
Access control is implemented using Better Auth's access control plugin:

```typescript
const allAccess = {
    billing: ["create", "update", "delete", "view"],
    member: ["create", "update", "delete", "view"]
};

const roles = {
    admin: ac.newRole(allAccess),
    member: ac.newRole({
        billing: ["view"],
        member: []
    })
};
```

### Permission Levels
- **Admin**: Full access to all resources
- **Member**: Limited access (billing view only)

## Database Integration

### Prisma Adapter
Uses Prisma adapter for PostgreSQL integration:

```typescript
database: prismaAdapter(prisma, {
    provider: "postgresql",
}),
```

### Database Hooks
Session creation triggers notifications:

```typescript
databaseHooks: {
    session: {
        create: {
            before: async (session) => {
                // Create welcome notification
            }
        }
    }
}
```

## Plugins

### Enabled Plugins
- `jwt()` - JWT token support
- `twoFactor()` - 2FA functionality
- `username()` - Username validation
- `multiSession()` - Multiple concurrent sessions
- `organization()` - Organization management

## Integration Points

### Middleware Integration
Auth middleware extracts session data for request context:

```typescript
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    const data = await authService.session(request.headers);
    if (data) {
        request.user = data.user;
        request.session = data.session;
    }
}
```

### Controller Integration
Auth controller delegates to Better Auth:

```typescript
const res = await auth.handler(
    new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
    })
);
```

## Security Features

### Trusted Origins
CORS configuration for security:

```typescript
trustedOrigins: corsConfig.origin,
```

### Host Trust
Environment-based host validation:

```typescript
trustHost: true,
```

## Best Practices
- Use role-based access control for authorization
- Implement proper session management
- Enable 2FA for enhanced security
- Validate usernames with appropriate regex
- Use database hooks for side effects
- Configure trusted origins properly
- Monitor session creation for notifications
- Keep auth configuration centralized