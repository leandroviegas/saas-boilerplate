# Enums Documentation

## Overview
Enums define constant values used throughout the application for type safety and consistency. They categorize events, types, and other fixed sets of values.

## Architecture Pattern

### TypeScript Enums
Enums are defined using TypeScript enum syntax:

```typescript
export enum wsTypeEnum {
    NEW_NOTIFICATION = 'new-notification',
    SESSION_REVOKED = 'session-revoked',
}

export enum wsEventEnum {
    NOTIFICATION = 'notification',
    AUTH = 'auth'
}
```

### Naming Convention
- Use descriptive, UPPER_SNAKE_CASE names
- Prefix with domain (ws = websocket, etc.)
- Use consistent suffixes (Enum, Type, etc.)

## Current Enums

### WebSocket Enums (`websocketsEnums.ts`)

#### Message Types (`wsTypeEnum`)
Defines the types of real-time messages sent to clients:

- `NEW_NOTIFICATION` - New notification available
- `SESSION_REVOKED` - User session has been revoked

#### Event Types (`wsEventEnum`)
Defines WebSocket event channels:

- `NOTIFICATION` - Notification-related events
- `AUTH` - Authentication-related events

## Usage Patterns

### WebSocket Communication
Enums are used in WebSocket services for type-safe messaging:

```typescript
import { wsTypeEnum, wsEventEnum } from '@/enums/websocketsEnums';

// Publishing messages
await websocketsService.publish({
    to: { user: userId },
    event: wsEventEnum.NOTIFICATION,
    data: {
        type: wsTypeEnum.NEW_NOTIFICATION,
        // ... notification data
    }
});
```

### Type Safety
Enums provide compile-time validation:

```typescript
// TypeScript ensures only valid enum values
const event: wsEventEnum = wsEventEnum.NOTIFICATION;
```

## Integration Points

### WebSocket Service
Enums are used by the WebSocket service for:
- Event channel identification
- Message type classification
- Room-based message routing

### Redis Pub/Sub
Enums define the channels for Redis-based message distribution.

## Best Practices
- Use enums for fixed sets of related constants
- Keep enum values descriptive and unique
- Use string values for serialization compatibility
- Group related enums in the same file
- Document the purpose and usage of each enum value
- Consider using string unions for simpler cases
- Maintain backward compatibility when adding new values