# Utils Documentation

## Overview
Utils contain reusable utility functions that perform common operations across the application. They encapsulate low-level operations and provide consistent interfaces.

## Architecture Pattern

### Pure Functions
Utils are typically pure functions with no side effects:

```typescript
export function parseHeaders(reqHeaders: IncomingHttpHeaders): Headers {
    // Pure transformation logic
}
```

### Focused Responsibility
Each utility has a single, well-defined purpose.

## Current Utils

### Header Parsing (`parseFastifyHeaders.ts`)

#### `parseHeaders` Function
Converts Fastify's `IncomingHttpHeaders` to Web API `Headers`:

**Purpose:**
- Bridge Fastify's header format to standard Web API Headers
- Handle array-valued headers properly
- Used in authentication flows

**Usage:**
```typescript
import { parseHeaders } from '@/utils/parseFastifyHeaders';

const headers = parseHeaders(request.headers);
// headers is now a standard Headers object
```

**Features:**
- Handles single string values
- Handles array values (appends each)
- Filters out null/undefined values
- Type-safe conversion

## Usage Patterns

### Authentication Integration
Used in auth controllers to convert headers for external auth libraries:

```typescript
const headers = parseHeaders(request.headers);
const res = await auth.handler(new Request(url, {
    method: request.method,
    headers,
    body: request.body ? JSON.stringify(request.body) : undefined,
}));
```

### Framework Bridging
Acts as an adapter between different header representations.

## Best Practices
- Keep utilities focused and testable
- Use pure functions when possible
- Provide clear TypeScript types
- Document usage examples
- Handle edge cases (arrays, nulls, etc.)
- Use descriptive function names
- Consider performance for frequently used utilities
- Test utilities thoroughly with various inputs