---
name: ddd-pattern-standard
description: Apply Domain-Driven Design (DDD) patterns to ElysiaJS projects. Standardizes directory structure (core, domain, application, infrastructure, interfaces), service orchestration with Prisma (no repositories), error handling, and TypeBox schemas. Use when restructuring, creating new domains, or implementing services and controllers.
---

# DDD Pattern Standard for SaaS Boilerplate

Standardized Domain-Driven Design (DDD) architecture for ElysiaJS-based TypeScript API.

## Directory Structure

```text
src/
 ├── core/                   # Shared, cross-cutting concerns (Global)
 │   ├── errors/             # Error handlers and custom error classes
 │   ├── types/              # Project-wide TypeScript types
 │   ├── constants/          # Enums and global constants
 │   ├── utils/              # Pure utility functions
 │   └── locales/            # i18n/L10n translation files
 │
 ├── domain/                 # Business logic abstractions and rules
 │   ├── shared/             # Base classes like AbstractService
 │   └── {domain}/           # Domain entities, rules, and interfaces
 │       ├── {domain}.entity.ts
 │       ├── {domain}.rules.ts
 │       └── {domain}.types.ts
 │
 ├── application/            # Use cases and orchestration (Services)
 │   ├── index.ts            # Service instantiation and export registry
 │   └── {domain}/           # Orchestration services for a specific domain
 │       └── {domain}.service.ts
 │
 ├── infrastructure/         # External tool implementations
 │   ├── config/             # Environment and application configuration
 │   ├── auth/               # Auth implementation (e.g., Better-Auth)
 │   ├── database/           # Prisma client, transactions, and seeds
 │   ├── cache/              # Redis/Cache implementation
 │   ├── logger/             # Logging service implementation
 │   ├── websocket/          # Socket.io/WS server setup
 │   └── payment/            # Third-party providers (Stripe, etc.)
 │
 └── interfaces/             # Entry points for external communication
     └── http/               # REST API Layer
         ├── server.ts       # Application entry point
         ├── routes.ts       # Main router registry
         ├── controllers/    # Request handlers (admin, member, public)
         ├── middleware/     # Auth, logs, and validation middleware
         ├── schemas/        # Elysia/TypeBox validation schemas
         └── decorators/     # Custom Elysia decorators (e.g., @Transactional)
```

## Pattern Guidelines

### 1. No Repositories
Direct use of the Prisma client (or its transaction context) is preferred within the **Application Layer** services to reduce boilerplate. Business rules must be moved to the **Domain Layer**.

### 2. Service Orchestration
- **Application Services**: Inherit from `AbstractService` in `@/domain/shared/abstract.service`.
- **Dependency Injection**: Services receive `PrismaTransactionContext` in their constructor.
- **Registry**: All services must be instantiated and exported in `src/application/index.ts`.

### 3. Error Handling
- **Registry**: Map internal exceptions to HTTP responses in `@/core/errors/error.handler.ts`.
- **Flow**: Domain rules throw specific errors -> Application Service propagates -> Global Error Handler catches and translates.

### 4. Schema Validation
- **Location**: `interfaces/http/schemas/models/{domain}.schema.ts`.
- **standard**: Use **TypeBox** for all request/response validation.
- **DTOs**: Controllers must use these schemas for `.body`, `.query`, and `.params` validation.

### 5. Infrastructure Isolation
- Implementation details (Redis client, S3 client, Stripe SDK) live in `infrastructure`.
- Domain-specific interfaces for these tools live in `domain/{domain}/`.

### 6. Import Aliases (tsconfig.json)
Always use these aliases to maintain layer isolation:
- `@/core/*` -> `src/core/*`
- `@/domain/*` -> `src/domain/*`
- `@/application/*` -> `src/application/*`
- `@/infrastructure/*` -> `src/infrastructure/*`
- `@/interfaces/*` -> `src/interfaces/*`

## Implementation Example

### Application Service (`src/application/user/user.service.ts`)
```typescript
import { AbstractService } from "@/domain/shared/abstract.service";
import { Transactional } from "@/interfaces/http/decorators/transactional";

export class UserService extends AbstractService {
  @Transactional()
  async createUser(data: any) {
    return await this.tx.user.create({ data });
  }
}
```

### Controller (`src/interfaces/http/controllers/user.controller.ts`)
```typescript
import { Elysia } from "elysia";
import { userService } from "@/application";
import { UserSchema } from "@/interfaces/http/schemas/models/user.schema";

export const userController = new Elysia({ prefix: "/user" })
  .post("/", ({ body }) => userService.createUser(body), {
    body: UserSchema
  });
```
