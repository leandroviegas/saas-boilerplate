# State Management Documentation

## Overview
State management in the web application uses React Context API for global state and local component state for component-specific data. For server state, TanStack Query (React Query) is used. This approach provides a simple yet powerful pattern for managing application state.

## Architecture Pattern

### Context API
React Context provides a way to pass data through the component tree without having to pass props manually at every level.

### Provider Pattern
Global state is managed through providers that wrap the application:

```tsx
// In context/AuthContext.tsx
export function AuthProvider({ children, user: u, session: s }: AuthProviderProps) {
  const [user, setUser] = useState<BetterUser | undefined>(parseUser(u));
  const [session, setSession] = useState<Session | undefined>(s);
  
  return (
    <AuthContext.Provider value={{
      user,
      session,
      signIn,
      signUp,
      signOut,
      updateSession
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Hook Access
Components access state through custom hooks:

```typescript
// In hooks/useAuth.tsx
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## Core Contexts

### Auth Context
Manages authentication state using Better Auth:
```typescript
const { user, session, signIn, signUp, signOut, updateSession } = useAuth();
```

The AuthContext (in [`src/context/AuthContext.tsx`](web/src/context/AuthContext.tsx)):
- Manages user session
- Handles sign in/up/out
- Updates session state
- Integrates with WebSockets
- Parses user images with static URL handling

### Translation Context
Manages internationalization:
```typescript
const { t, locale } = useTranslation();
```

### Theme Context
Manages application theme:
```typescript
const { theme, setTheme, toggleTheme } = useTheme();
```

Theme is persisted using js-cookie:
```typescript
// Theme is stored in cookies
Cookies.set('theme', theme)
```

### Query Context
TanStack Query for server state:
```typescript
// In providers/QueryProvider.tsx
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

## React Query Hooks

### Query Keys
Query keys are defined for each resource:
```typescript
// In hooks/queries/useProducts.ts
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: GetAdminProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};
```

### Fetch Queries
```typescript
// Fetch all products
export function useProducts(params?: GetAdminProductsParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      const response = await productsApi.getAdminProducts(params);
      return response;
    },
  });
}

// Fetch single product by ID
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await productsApi.getAdminProductsId(id);
      return response.data;
    },
    enabled: !!id,
  });
}
```

### Mutations
```typescript
// Create product
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: PostAdminProductsBody) => {
      const response = await productsApi.postAdminProducts(productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
```

## Usage Patterns

### Accessing State
```tsx
function Dashboard() {
  const { user } = useAuth();
  const { notifications } = useApp();
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
    </div>
  );
}
```

### Updating State
```tsx
function Settings() {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button onClick={() => signOut()}>Sign Out</Button>
    <Button onClick={toggleTheme}>Toggle Theme</Button>
  );
}
```

### Nested Providers
Multiple context providers can be nested:

```tsx
function App() {
  return (
    <AuthProvider>
      <QueryProvider>
        <ThemeProvider>
          <TranslationProvider>
            <RouterProvider />
          </TranslationProvider>
        </ThemeProvider>
      </QueryProvider>
    </AuthProvider>
  );
}
```

## State Categories

### Server State
Data fetched from the server using TanStack Query:
- Automatic background refetching
- Caching with staleTime
- Optimistic updates
- Query invalidation

### Client State
Local application state:
- Theme preferences (js-cookie)
- UI state (modals, sidebars)
- Form state (handled by React Hook Form)

### Persistent State
State that persists across sessions:
- User preferences in cookies (theme)
- Language preference in cookies
- Authentication tokens (handled by Better Auth)

## Custom Hooks

### useAuth
Located at [`src/hooks/useAuth.tsx`](web/src/hooks/useAuth.tsx):
- Provides authentication context access

### useCustomForm
Located at [`src/hooks/useCustomForm.tsx`](web/src/hooks/useCustomForm.tsx):
- Handles form submission
- Manages loading states
- Maps server errors to fields

### useTheme
Located at [`src/hooks/useTheme.ts`](web/src/hooks/useTheme.ts):
- Theme state management
- Toggle functionality
- Cookie persistence

### useLanguage
Located at [`src/hooks/useLanguage.ts`](web/src/hooks/useLanguage.ts):
- Language switching
- Cookie persistence

### useWebsockets
Located at [`src/hooks/useWebsockets.ts`](web/src/hooks/useWebsockets.ts):
- WebSocket connection management
- Event handling

## Best Practices
- Keep state as local as possible
- Use separate contexts for unrelated state
- Memoize expensive computations
- Use TypeScript for state types
- Provide clear APIs through custom hooks
- Avoid deeply nested providers
- Consider performance implications
- Use appropriate state management for data type
- Implement proper error handling
- Test state logic in isolation
- Use TanStack Query for server state
- Use React Query hooks for data fetching
