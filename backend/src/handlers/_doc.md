# Handlers Documentation

## Overview
Handlers process different types of errors and responses, converting them into consistent, user-friendly formats. They handle database errors, validation errors, and response formatting.

## Architecture Pattern

### Error Handler Functions
Handlers are specialized functions for different error types:

```typescript
export const handlePrismaError = (error: PrismaClientKnownRequestError): ErrorResponse
export const handleValidationError = (error: ValidationError, lang: string)
export const handlePrismaValidationError = (error: PrismaClientValidationError): ErrorResponse
```

### Response Transformation
Handlers transform raw errors into structured responses:

```typescript
interface ErrorResponse {
    code: string;
    status: number;
    validations?: ValidationMessageI[];
}
```

## Core Handlers

### Error Handler (`error.handler.ts`)
Main error processing orchestrator:

**Features:**
- Routes different error types to specialized handlers
- Applies consistent error response format
- Integrates with internationalization

**Error Flow:**
1. Identify error type (AppError, ValidationError, PrismaError, etc.)
2. Route to appropriate specialized handler
3. Format response with translations
4. Return appropriate HTTP status

### Prisma Error Handler (`prisma.handler.ts`)
Converts Prisma database errors to user-friendly messages:

**Error Code Mapping:**
```typescript
const PRISMA_ERROR_MAP = {
    P2002: { code: "UNIQUE_CONSTRAINT_VIOLATION", status: 409 },
    P2003: { code: "FOREIGN_KEY_CONSTRAINT_VIOLATION", status: 400 },
    P2025: { code: "RECORD_NOT_FOUND", status: 404 },
    // ... more mappings
};
```

**Special Cases:**
- Unique constraint violations with field extraction
- Foreign key violations with related field identification
- Null constraint violations with field listing

### Validation Error Handler (`validation.handler.ts`)
Processes JSON Schema validation errors:

**Features:**
- Field name extraction from validation paths
- Internationalization support (en/pt)
- Keyword-based error mapping

**Field Extraction:**
```typescript
const getFieldNameFromValidationError = (error: ValidationErrorItem): string => {
    // Extract field names from various validation error formats
}
```

### Response Message Handler (`response-message.hander.ts`)
Transforms response payloads for internationalization:

**Features:**
- Automatically adds translated messages to responses
- Skips static assets and documentation routes
- Preserves original response structure

## Error Response Format

### Consistent Structure
All errors follow the same JSON structure:

```json
{
    "code": "ERROR_CODE",
    "validations": [
        {
            "field": "fieldName",
            "message": "User-friendly error message"
        }
    ]
}
```

### Validation Messages
Detailed field-level validation errors:

```typescript
interface ValidationMessageI {
    field?: string;
    message: string;
}
```

## Integration Points

### Fastify Error Hook
Error handlers are registered as Fastify error hooks:

```typescript
fastify.setErrorHandler(errorHandler);
```

### Response Serialization
Response handlers are registered for payload transformation:

```typescript
fastify.addHook('preSerialization', responseMessageHandler);
```

## Best Practices
- Map database errors to user-friendly messages
- Extract field names from technical error details
- Support multiple languages for error messages
- Maintain consistent error response structure
- Log technical details while showing user-friendly messages
- Handle edge cases and unknown error types
- Document error codes and their meanings