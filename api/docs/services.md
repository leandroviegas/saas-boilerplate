# Services Documentation

## Overview
Services in this api architecture follow a layered pattern where business logic is encapsulated in service classes. Services handle data operations, business rules, and interactions with external systems while maintaining separation of concerns.

## Architecture Pattern

### Abstract Service Base Class
All services extend from `AbstractService` which provides:
- Prisma client instance for database operations
- Consistent dependency injection pattern

```typescript
export class AbstractService {
    prisma: ExtendedPrismaClient;

    constructor(prisma: ExtendedPrismaClient) {
        this.prisma = prisma;
    }
}
```

### Service Instantiation
Services are instantiated as singleton instances at the module level:

```typescript
export class UserService extends AbstractService {
    // service methods...
}

export const userService = new UserService(prisma);
```

## Common Patterns

### CRUD Operations
Services typically implement standard CRUD operations:
- `findAll(pagination)` - Retrieve paginated list of records
- `findById(id)` - Retrieve single record by ID
- `create(data)` - Create new record
- `update(id, data)` - Update existing record
- `delete(id)` - Delete record

### Business Logic Methods
Services contain domain-specific business logic methods that:
- Validate data before operations
- Handle complex transactions
- Integrate with external services (S3, email, etc.)
- Apply business rules and constraints

### Error Handling
Services throw descriptive errors that are caught by error handlers:
- Use `findUniqueOrThrow` for required records
- Throw `AppError` for business logic violations
- Let Prisma errors bubble up for database constraints

## Integration Patterns

### External Service Dependencies
Services can depend on other services:
```typescript
import { s3Service } from "./s3.service";
import { emailService } from "./email.service";
```

### Database Extensions
Services use extended Prisma client with pagination support:
```typescript
const { data, meta } = await this.prisma.user.paginate({
    orderBy: { createdAt: 'desc' },
}, pagination);
```

## File Organization
- `abstract.service.ts` - Base service class
- `{domain}.service.ts` - Domain-specific service implementations
- Singleton exports for dependency injection

## Best Practices
- Keep services focused on single domain/responsibility
- Use dependency injection for testability
- Handle errors at appropriate levels
- Document complex business logic
- Use TypeScript types for all parameters and return values