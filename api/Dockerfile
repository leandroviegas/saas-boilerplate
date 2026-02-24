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

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY prisma ./prisma/
COPY startpoint.sh ./

RUN chmod +x startpoint.sh

ENV NODE_ENV=production

EXPOSE 4444

CMD ["./startpoint.sh"]
