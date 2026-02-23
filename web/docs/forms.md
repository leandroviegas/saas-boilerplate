# Forms Documentation

## Overview
Forms follow a standardized pattern combining React Hook Form, TypeBox validation with a custom resolver, and custom hooks for consistent behavior across the application.

## Architecture Pattern

### 1. Schema Definition
Schemas are defined using TypeBox at the top of the file.

```typescript
import { Type, Static } from "@sinclair/typebox";

const signInSchema = Type.Object({
    email: Type.String({ format: "email" }),
    password: Type.String(),
});

export type SignInFormValues = Static<typeof signInSchema>;
```

### 2. Form Initialization
Use the `useForm` hook with the `typeboxResolver` and defined types.

```typescript
const form = useForm<SignInFormValues>({
  resolver: typeboxResolver(signInSchema, { locale }),
  defaultValues: {
    email: "",
    password: "",
  },
});
```

### 3. Submission Logic
Use the `useCustomForm` hook to handle standardized submission, loading states, and error mapping.

```typescript
const { onFormSubmit, isLoading } = useCustomForm();
const { signIn } = useAuth();

const onLoginSubmit = async (data: SignInFormValues) => {
    onFormSubmit(data, signIn, form.setError);
};
```

### 4. UI Structure
Forms use the Shadcn/UI `Form` components for accessibility and consistent styling.

```tsx
"use client";

import { useForm, type ControllerRenderProps } from "react-hook-form";
import { typeboxResolver } from "@/lib/typebox-resolver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="email"
      render={({ field }: { field: ControllerRenderProps<SignInFormValues, "email"> }) => (
        <FormItem>
          <FormLabel>{t('email')}</FormLabel>
          <FormControl>
            <Input placeholder="name@example.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <Button type="submit" disabled={isLoading}>
      {isLoading ? t('signing in') + "..." : t('sign in')}
    </Button>
  </form>
</Form>
```

## Key Principles

### Client Components
Forms must be marked with `"use client"`.

### Internationalization
All labels, placeholders, and messages must use the `t()` function from `useTranslation`.

### Type Safety
Always use `ControllerRenderProps` or inferred types for field renders to ensure type safety.

### Loading States
Always disable the submit button and show a loading indicator using the `isLoading` state from `useCustomForm`.

## Validation Patterns

### TypeBox Resolver
The web application uses a custom TypeBox resolver instead of Zod. The resolver supports:
- String validation (format, minLength, maxLength, pattern)
- Number validation (minimum, maximum, multipleOf)
- Required fields
- Enum validation
- Custom error messages by locale

### Basic Validation
```typescript
const formSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: "email" }),
});
```

### Complex Validation
```typescript
const formSchema = Type.Object({
  password: Type.String({ minLength: 8 }),
  confirmPassword: Type.String(),
});
```

### Optional Fields
```typescript
const formSchema = Type.Object({
  name: Type.Optional(Type.String()),
  bio: Type.Optional(Type.String({ maxLength: 500 })),
});
```

### Format Validation
```typescript
const formSchema = Type.Object({
  email: Type.String({ format: "email" }),
  date: Type.String({ format: "date" }),
  uri: Type.String({ format: "uri" }),
});
```

## Error Handling

### Field-Level Errors
Each field should display its own error:

```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Form-Level Errors
Display errors at the form level for cross-field validation:

```tsx
<Form>
  <Alert variant="destructive">
    <AlertDescription>{form.formState.errors.root?.message}</AlertDescription>
  </Alert>
</Form>
```

### Field-Level Server Errors
The `useCustomForm` hook automatically maps server-side validation errors to form fields:

```typescript
const onFormSubmit = async (data, executingFunction, setError) => {
  try {
    const resp = await executingFunction(data);
    return resp;
  } catch (error: any) {
    if (error.response?.data?.validations) {
      error.response.data.validations?.map((fieldMessage: FieldMessageT<string>) => {
        setError(fieldMessage.field, {
          type: "manual",
          message: fieldMessage.message
        });
      });
    }
  }
};
```

## Custom Hooks

### useCustomForm
Located at [`src/hooks/useCustomForm.tsx`](web/src/hooks/useCustomForm.tsx):
- Manages loading state
- Handles form submission
- Maps server validation errors to form fields
- Prevents double submissions

### typeboxResolver
Located at [`src/lib/typebox-resolver.ts`](web/src/lib/typebox-resolver.ts):
- Compiles TypeBox schemas for validation
- Supports locale-based error messages
- Caches validators for performance
- Handles nested field paths

## Best Practices
- Always mark form components with `"use client"`
- Use TypeBox for schema definition and validation
- Leverage `useCustomForm` for consistent submission handling
- Include loading states on all form submissions
- Use internationalization for all user-facing text
- Implement proper error messages for validation failures
- Keep forms focused on single purposes
- Use proper accessibility attributes (labels, descriptions)
