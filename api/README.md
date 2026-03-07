# ElysiaJS Playground

This is a basic ElysiaJS application running on Node.js with TypeScript and pnpm.

## Features
- **Middleware**: Logger middleware in `src/middlewares/logger.middleware.ts`.
- **Controllers**: User and Product controllers in `src/controllers/`.
- **Services**: Singleton services in `src/services/`.
- **Validation**: Route validation using Elysia's built-in `t` schema.
- **WebSockets**: Simple WebSocket implementation in `src/index.ts`.
- **In-memory Storage**: Data is stored in service variables (no DB).

## How to run

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run in development mode:
   ```bash
   pnpm dev
   ```

3. Run in production mode:
   ```bash
   pnpm start
   ```

## API Endpoints
- `GET /users`: Get all users.
- `POST /users`: Add a new user (Body: `{ "name": "string" }`).
- `GET /products`: Get all products.
- `POST /products`: Add a new product (Body: `{ "name": "string", "price": number }`).
- `WS /ws`: WebSocket endpoint.
