# NewChatBot API Boilerplate

A modern Fastify API boilerplate with Better-auth authentication, Prisma ORM, and Swagger documentation.

## Features

- ✅ **Fastify** - High-performance Node.js web framework
- ✅ **Better-auth** - Simple and secure authentication with email support
- ✅ **Prisma ORM** - Type-safe database access with SQLite
- ✅ **Swagger Documentation** - Auto-generated API docs
- ✅ **TypeScript** - Full type safety throughout the project
- ✅ **Clean Controller Pattern** - Fastify-native controller functions
- ✅ **pnpm** - Fast and efficient package manager

## Tech Stack

- **Framework**: Fastify v5.x
- **Authentication**: Better-auth v0.6.1 (structure implemented)
- **Database**: SQLite with Prisma ORM (PostgreSQL ready)
- **Documentation**: Swagger/OpenAPI 3.0
- **Language**: TypeScript
- **Package Manager**: pnpm

## Project Structure

```
api/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── auth/
│   │   ├── better-auth.ts     # Better-auth configuration
│   │   └── auth.controller.ts # Authentication functions
│   ├── controllers/
│   │   ├── auth.controller.ts # Auth routes
│   │   └── user.controller.ts # User routes
│   ├── schemas/
│   │   └── user.schema.ts     # TypeBox schemas
│   ├── services/
│   │   └── user.service.ts    # Business logic
│   ├── lib/
│   │   └── prisma.ts          # Prisma client setup
│   └── server.ts              # Main application entry point
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- SQLite database (built-in) or PostgreSQL

### Installation

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL` - SQLite connection (e.g., `file:./dev.db`) or PostgreSQL
   - `BETTER_AUTH_SECRET` - Secret key for Better-auth
   - `BETTER_AUTH_APP_URL` - Your application URL

3. **Set up database**
   ```bash
   # Generate Prisma client
   pnpm run db:generate
   
   # Run database migrations
   pnpm run migrate:dev
   ```

4. **Start development server**
   ```bash
   pnpm run dev
   ```

The server will start at `http://localhost:3000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health

## Available Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build the project for production
- `pnpm run start` - Start production server
- `pnpm run db:generate` - Generate Prisma client
- `pnpm run migrate:dev` - Create and apply database migration
- `pnpm run migrate:deploy` - Deploy migrations to production
- `pnpm run migrate:reset` - Reset database and run all migrations

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/session` - Get current session

### Users
- `GET /users` - Get all users (protected)
- `GET /users/:id` - Get user by ID (protected)
- `POST /users` - Create user (protected)
- `PUT /users/:id` - Update user (protected)
- `DELETE /users/:id` - Delete user (protected)
- `GET /users/me` - Get current user (protected)

### System
- `GET /health` - Health check endpoint

## Controller Pattern

This boilerplate uses Fastify's native controller function pattern:

```typescript
export async function userController(fastify: FastifyInstance) {
  fastify.get("/", {
    schema: { ... }
  }, async (request, reply) => {
    // Route handler
  });
  
  fastify.post("/", {
    schema: { ... }
  }, async (request, reply) => {
    // Route handler
  });
}
```

### Server Registration

Controllers are registered with prefixes:

```typescript
server.register(authController, { prefix: "/auth" });
server.register(userController, { prefix: "/users" });
```

## Authentication Flow

1. **Register**: Send user details to `/auth/register`
2. **Login**: Send email/password to `/auth/login`
3. **Session**: Use Bearer token from login response for protected routes

### Example Request

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get users (protected)
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

The Prisma schema includes Better-auth required tables:
- `User` - User information
- `Account` - OAuth accounts
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

## Development

### Adding New Controllers

1. Create a controller file in `src/controllers/`
2. Export an async function that takes `FastifyInstance`
3. Define routes using `fastify.get/post/put/delete`
4. Register in `server.ts` with `server.register(yourController, { prefix: "/api" })`

### Adding New Services

1. Create a service file in `src/services/`
2. Export a class with business logic methods
3. Import and use in controllers

### Adding New Schemas

1. Create a schema file in `src/schemas/`
2. Export TypeBox schemas
3. Use in controller route schemas

### Error Handling

All endpoints return consistent response format:
```typescript
{
  success: boolean,
  data: T | null,
  error?: string
}
```

## Production Deployment

1. **Build the project**:
   ```bash
   pnpm run build
   ```

2. **Set environment variables** in production

3. **Run database migrations**:
   ```bash
   pnpm run migrate:deploy
   ```

4. **Start production server**:
   ```bash
   pnpm run start
   ```

## Contributing

1. Follow the Fastify controller pattern
2. Add proper TypeScript types
3. Include Swagger schemas for all endpoints
4. Test authentication flows
5. Update documentation

## License

ISC License