# Components Documentation

## Overview
Components are organized in a structured directory layout following atomic design principles. The component system uses Shadcn/UI as the base and extends it with feature-specific components.

## Component Organization

### Directory Structure
```
components/
├── ui/                  # Shadcn/UI base components
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── data-table.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── field.tsx
│   ├── form.tsx
│   ├── input-otp.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── loading.tsx
│   ├── native-select.tsx
│   ├── pagination.tsx
│   ├── password-input.tsx
│   ├── popover.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── switch.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   └── textarea.tsx
└── dashboard/            # Feature-specific components
    ├── sidebar.tsx
    ├── header.tsx
    └── ...
```

### Component Categories

#### UI Components (`components/ui/`)
Base components from Shadcn/UI that provide atomic building blocks:
- Buttons, Inputs, Labels
- Forms, Form Fields
- Cards, Modals, Dialogs
- Tables, Data Tables
- Navigation elements
- Feedback components (badges, switches)
- Form controls (select, checkbox, etc.)

These components are:
- Accessible (follow WCAG guidelines)
- Themeable via CSS variables
- Composable
- Well-documented with props

#### Feature Components (`components/dashboard/`)
Domain-specific components built on top of UI components:
- Layout components (Sidebar, Navbar, Header)
- Feature-specific modules
- Composed complex components
- Business logic integrated

## Usage Patterns

### Importing UI Components
```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
```

### Using Feature Components
```typescript
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Navbar } from "@/components/dashboard/components/Navbar";
import { NotificationDropdown } from "@/components/dashboard/components/NotificationDropdown";
```

### Composition
Build complex interfaces by composing components:

```tsx
<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
  </CardHeader>
  <CardContent>
    <form>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" />
        </div>
        <Button type="submit">Save</Button>
      </div>
    </form>
  </CardContent>
</Card>
```

## Shadcn/UI Integration

### Component Installation
Add new Shadcn/UI components via CLI:
```bash
npx shadcn@latest add button
npx shadcn@latest add form
```

### Customization
Components can be customized through:
- CSS variables in `app/globals.css` or `app/theme.css`
- Component props
- Tailwind CSS utility classes

## Additional UI Components

### Data Table
The project includes a powerful DataTable component with:
- Column definitions
- Sorting
- Filtering
- Pagination

```typescript
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

<DataTable columns={columns} data={data} />
```

### Form Components
Full form support with Shadcn/UI:
```typescript
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
```

### Dialog/Modal
```typescript
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
```

### Select
```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
```

## Best Practices

### Component Design
- Keep components focused on single responsibilities
- Use TypeScript for all props
- Provide sensible defaults
- Document complex props

### Accessibility
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation
- Test with screen readers

### Performance
- Use `React.memo` for frequently re-rendered components
- Implement proper memoization with dependencies
- Lazy load components when appropriate

### Styling
- Use Tailwind CSS utility classes
- Follow design system tokens
- Maintain consistent spacing and sizing
- Use responsive design patterns

### Client Components
Use `"use client"` directive when components:
- Use React hooks (useState, useEffect, useContext)
- Use browser-only APIs
- Handle user interactions (onClick, onChange)
