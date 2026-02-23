# API Documentation

## Overview
The web application uses Orval to generate type-safe API clients from the api's OpenAPI specification. This ensures type safety and consistency across API calls.

## Architecture Pattern

### Axios Instance
The base axios instance is configured in [`src/api/axios-instance.ts`](web/src/api/axios-instance.ts) with:
- Base URL from environment variables
- Credentials enabled for cookies
- Response interceptor for error handling (401 redirects to auth)
- Toast notifications for API errors

### Generated API Clients
- Orval generates type-safe axios clients from OpenAPI spec
- Located in `src/api/generated/`
- Organized by areas (users, products, coupons, payments, etc.)
- Uses `customInstance` mutator for better integration

### Generation Command
```bash
cd web && pnpm orval
```

## Usage Patterns

### Basic API Call
```typescript
import { getUsers } from '@/api/generated/users/users';

const usersApi = getUsers();
const users = await usersApi.getMemberUsersMe();
```

### API Client Structure
Generated API clients follow this pattern:
```typescript
// Each resource has its own client factory function
export const getUsers = () => ({
  getMemberUsersMe: (options?) => 
    customInstance<GetMemberUsersMe200>({url: '/api/v1/member/users/me', method: 'GET'}, options),
  getAdminUsers: (params?, options?) => 
    customInstance<GetAdminUsers200>({url: '/api/v1/admin/users/', method: 'GET', params}, options),
  getAdminUsersId: (id: string, options?) => 
    customInstance<GetAdminUsersId200>({url: `/api/v1/admin/users/${id}`, method: 'GET'}, options),
  postAdminProducts: (data: PostAdminProductsBody, options?) => 
    customInstance<PostAdminProducts201>({url: '/api/v1/admin/products/', method: 'POST', data}, options),
  putAdminUsersId: (id: string, data: PutAdminUsersIdBody, options?) => 
    customInstance<PutAdminUsersId200>({url: `/api/v1/admin/users/${id}`, method: 'PUT', data}, options),
  deleteAdminUsersId: (id: string, options?) => 
    customInstance<DeleteAdminUsersId204>({url: `/api/v1/admin/users/${id}`, method: 'DELETE'}, options),
});

// Type exports for response types
export type GetMemberUsersMeResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUsers>['getMemberUsersMe']>>>
```

### Type Safety
All generated clients include:
- Request body types (*Body)
- Response data types (*Response)
- Query parameter types (*Params)
- Path parameter types
- Result types for easy typing

### Error Handling
API clients return typed responses with error handling:
```typescript
try {
  const response = await usersApi.getAdminUsers({ page: 1 });
  // response.data contains typed data
} catch (error) {
  // Handle error appropriately
  // 401 errors automatically redirect to /auth
  // Other errors show toast notification
}
```

## API Organization

### By Resource
API clients are organized by api resources:
- `users/` - User management
- `products/` - Product catalog
- `product-prices/` - Product pricing
- `coupons/` - Coupon management
- `payment/` - Payment processing
- `notifications/` - User notifications
- `sessions/` - Session management

### Request/Response Types
Each API client exports:
- `*Result` - Result type for the operation
- Request body types (*Body)
- Response types (*200, *201, etc.)
- Query parameters type (*Params)

### Access Levels
Routes are organized by access level:
- `admin/*` - Admin endpoints
- `member/*` - Member endpoints
- `webhook/*` - Webhook endpoints

## Configuration

### Orval Config
The Orval configuration in [`orval.config.ts`](web/orval.config.ts) defines:
- OpenAPI spec location (`http://127.0.0.1:3000/docs/json`)
- Output directory (`./src/api/generated/`)
- Client type (axios)
- Mode (tags-split)
- Custom mutator using `customInstance`
- Operation name transformation

### Environment Variables
API base URL is configured via environment:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Best Practices
- Always use generated clients instead of raw axios
- Leverage TypeScript types for type safety
- Handle loading and error states appropriately
- Use consistent error handling patterns
- Keep API calls close to where they're used
- Use React Query hooks for server state management
- Use TanStack Query hooks for complex API interactions
