# Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY prisma.config.ts ./
COPY prisma ./prisma/
COPY src ./src/

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files for production dependencies
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/locales ./src/locales

# Generate Prisma client in production
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/server.js"]
