FROM node:22-alpine AS base

FROM base AS server-deps
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production

FROM base AS server-build
WORKDIR /app/server
COPY server/package*.json ./
COPY server/tsconfig.json ./
COPY server/prisma ./prisma
COPY server/src ./src
RUN npm ci && npx prisma generate && npm run build

FROM base AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM base AS runner
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=server-deps /app/server/node_modules ./server/node_modules
COPY --from=server-build /app/server/dist ./server/dist
COPY --from=server-build /app/server/prisma ./server/prisma
COPY --from=server-build /app/server/node_modules/.prisma ./server/node_modules/.prisma
COPY server/package.json ./server/

COPY --from=client-build /app/client/.next ./client/.next
COPY --from=client-build /app/client/public ./client/public
COPY --from=client-build /app/client/package.json ./client/
COPY --from=client-build /app/client/node_modules ./client/node_modules

RUN mkdir -p server/uploads

EXPOSE 5000 3000

CMD ["sh", "-c", "cd server && npx prisma db push --skip-generate 2>/dev/null; node dist/index.js & cd /app/client && npm start"]
