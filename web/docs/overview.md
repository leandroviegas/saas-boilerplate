# Web Overview

## Overview
The web application is built with Next.js using the App Router, TypeScript, and pnpm. It follows a component-based architecture with a strong emphasis on type safety, accessibility, and internationalization.

## Core Technologies
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Package Manager**: pnpm
- **API Client Generation**: Orval (generates type-safe axios clients from OpenAPI spec)
- **Form Management**: React Hook Form
- **Validation**: TypeBox with custom `typeboxResolver`
- **UI Components**: Shadcn/UI (Radix UI + Tailwind CSS)
- **Icons**: Lucide React
- **Internationalization**: Custom `useTranslation` hook with React Context
- **State Management**: React Context API
- **Server State**: TanStack Query (React Query)
- **Authentication**: Better Auth
- **Toast Notifications**: Sonner
- **Theme Management**: js-cookie for persistence

## Architecture

### Directory Structure
```
src/
├── api/                    # Generated API clients from Orval
│   ├── axios-instance.ts  # Axios instance with interceptors
│   └── generated/         # Orval-generated clients
├── app/                   # Next.js App Router pages and layouts
├── components/            # React components
│   ├── ui/                # Shadcn/UI base components
│   └── dashboard/        # Feature-specific components
├── context/               # React Context providers
│   ├── AuthContext.tsx    # Authentication context
│   └── TranslationContext.tsx  # i18n context
├── enums/                 # TypeScript enumerations
├── hooks/                 # Custom React hooks
│   ├── useAuth.tsx        # Authentication hook
│   ├── useCustomForm.tsx  # Form submission hook
│   ├── useLanguage.ts     # Language switching hook
│   ├── useTheme.ts        # Theme management hook
│   ├── useTranslation.ts  # Translation hook
│   ├── useWebsockets.ts   # WebSocket hook
│   └── queries/           # React Query hooks
├── lib/                   # Utility functions and configurations
│   ├── auth-client.ts     # Better Auth client
│   ├── config.ts          # Environment configuration
│   ├── typebox-resolver.ts # TypeBox form resolver
│   └── utils.ts           # General utilities
├── locales/               # Translation files (i18n)
├── providers/             # Context providers
│   └── QueryProvider.tsx  # React Query provider
└── utils/                 # Helper functions
    ├── client/            # Client-side utilities
    │   ├── api.ts         # API utilities
    │   ├── socket.ts      # WebSocket client
    │   └── toast.ts       # Toast utilities
    └── server/            # Server-side utilities
```

### Design Principles
- **Type Safety**: Full TypeScript coverage with strict typing
- **Component Reusability**: Atomic design with UI components
- **Internationalization**: All user-facing text uses translation keys
- **Accessibility**: Semantic HTML and ARIA attributes
- **Performance**: Optimized with Next.js caching and Server Components

## Best Practices
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use TypeScript for all type definitions
- Implement proper error boundaries
- Follow accessibility guidelines (WCAG)
