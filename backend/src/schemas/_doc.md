# Schemas Documentation

## Overview
Schemas define data structures and validation rules using TypeBox (JSON Schema for TypeScript). They ensure type safety, runtime validation, and API documentation generation.

## Architecture Pattern

### Schema Organization
Schemas are organized into logical groups:
- `models/` - Database model schemas
- `pagination.ts` - Pagination utilities
- `schemas.ts` - Schema builders and utilities

### TypeBox Usage
All schemas use TypeBox for type-safe schema definitions:
```typescript
import { Type } from "@sinclair/typebox";

export const UserSchema = Type.Object({
    id: Type.String(),
    email: Type.String({ format: "email" }),
    name: Type.String(),
    // ...
});
```

## Schema Builders

### Multi Schema Builder
`multiSchemaBuilder` creates route schemas with automatic response wrapping:

```typescript
export const routesSchema = multiSchemaBuilder({
    getAllUsers: {
        tags: ["Users"],
        querystring: Type.Intersect([paginationSchema]),
        response: {
            200: {
                data: Type.Array(UserSchema),
                meta: metaSchema
            },
        },
    },
    // ...
});
```

### Response Wrapping
Successful responses (2xx) are automatically wrapped with success metadata:
```typescript
{
    "code": "success-code",
    "message": "Operation completed successfully",
    "data": { /* actual response data */ }
}
```

## Model Schemas

### Database Model Mapping
Model schemas mirror Prisma database models:
```typescript
const userFieldsS = {
    id: Type.String(),
    email: Type.String({ format: "email" }),
    // ... all fields from Prisma model
};

export const UserSchema = Type.Object(userFieldsS);
```

### Field Types
Common TypeBox types used:
- `Type.String()` - Text fields
- `Type.Integer()` - Numeric fields
- `Type.Boolean()` - Boolean fields
- `Type.Optional()` - Optional fields
- `Type.Array()` - Array fields

## Route Schemas

### Controller Integration
Route schemas are imported and used in controllers:
```typescript
import { routesSchema, UpdateUserBodyType } from "./user.schemas";

fastify.put("/:id", {
    schema: routesSchema.updateUser
}, handler);
```

### Type Extraction
Types are extracted from schemas for TypeScript safety:
```typescript
export type UpdateUserBodyType = Static<typeof routesSchema.updateUser.body>;
```

## Validation Features

### Built-in Validation
Schemas provide automatic validation for:
- Required vs optional fields
- Data types and formats
- String lengths and patterns
- Numeric ranges
- Array constraints

### Error Responses
Validation errors are automatically formatted:
```json
{
    "code": "VALIDATION_ERROR",
    "validations": [
        {
            "field": "email",
            "message": "Invalid email format"
        }
    ]
}
```

## Pagination Schema

### Standard Pagination
Reusable pagination schema for list endpoints:
```typescript
export const paginationSchema = Type.Object({
    page: Type.Optional(Type.Integer({ default: 1, minimum: 1 })),
    perPage: Type.Optional(Type.Integer({ default: 20, minimum: 1 })),
});
```

### Metadata Schema
Response metadata for paginated results:
```typescript
export const metaSchema = Type.Object({
    total: Type.Integer(),
    page: Type.Integer(),
    perPage: Type.Integer(),
});
```

## Best Practices
- Define all schemas using TypeBox for consistency
- Use model schemas to mirror database structure
- Extract TypeScript types from schemas
- Use `multiSchemaBuilder` for route schemas
- Include OpenAPI tags for documentation
- Keep schemas focused and reusable
- Use appropriate validation rules for data integrity