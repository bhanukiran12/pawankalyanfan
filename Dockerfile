# Default Dockerfile for Render (API gateway + microservices).
# Same as Dockerfile.backend — use Dockerfile.web for the Next.js frontend service.
# Combined API gateway + microservices for Render (single web service)
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json turbo.json ./
COPY packages ./packages
COPY services ./services

RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"
ENV DIRECT_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"

RUN npm run build --workspace=@pkf/shared && \
    npx prisma generate --schema=packages/database/prisma/schema.prisma && \
    npm run build --workspace=@pkf/database && \
    npm run build --workspace=@pkf/auth-service && \
    npm run build --workspace=@pkf/content-service && \
    npm run build --workspace=@pkf/community-service && \
    npm run build --workspace=@pkf/billing-service && \
    npm run build --workspace=@pkf/ai-service && \
    npm run build --workspace=@pkf/api-gateway

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl libc6-compat

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services ./services
COPY --from=builder /app/package.json ./
COPY scripts/start-render-backend.sh ./scripts/start-render-backend.sh

RUN chmod +x ./scripts/start-render-backend.sh

EXPOSE 4000

CMD ["./scripts/start-render-backend.sh"]
