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

RUN apk add --no-cache openssl

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY prisma ./prisma/
COPY --from=builder /app/dist ./dist
COPY startpoint.sh ./

RUN pnpm install --no-frozen-lockfile
RUN npx prisma generate

RUN chmod +x startpoint.sh

ENV NODE_ENV=production
EXPOSE 3001

CMD ["./startpoint.sh"]
