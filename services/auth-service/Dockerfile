FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/
COPY services/auth-service/package.json ./services/auth-service/
RUN npm install --workspace=@pkf/shared --workspace=@pkf/database --workspace=@pkf/auth-service

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=@pkf/shared
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
RUN npm run build --workspace=@pkf/auth-service

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/services/auth-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
EXPOSE 4001
CMD ["node", "dist/index.js"]
