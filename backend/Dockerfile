# ---------- Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

RUN pnpm install --no-frozen-lockfile
RUN npx prisma generate

COPY . .

RUN pnpm build


# ---------- Production ----------
FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
COPY --from=builder /app/dist ./dist

RUN pnpm install --no-frozen-lockfile
RUN npx prisma generate


ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/server.js"]
