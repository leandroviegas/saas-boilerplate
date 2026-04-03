# ---------- Production ----------
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY prisma ./prisma/
COPY src ./src/
COPY startpoint.sh ./
COPY tsconfig.json ./
COPY env* ./

RUN npm install -g pnpm
RUN pnpm install --no-frozen-lockfile

RUN pnpm db:generate

RUN chmod +x startpoint.sh

ENV NODE_ENV=production

EXPOSE 4444

CMD ["./startpoint.sh"]