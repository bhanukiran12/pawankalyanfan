# Single Render service: API (internal :4000) + Next.js fan site (public PORT)
FROM node:20-alpine AS backend-builder
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
    npm run build --workspace=@pkf/charity-service && \
    npm run build --workspace=@pkf/api-gateway

FROM node:20-alpine AS web-builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web ./apps/web

RUN npm ci --workspace=@pkf/web --include-workspace-root

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=/api
# Render injects service env at build time; mirror public key into Next bundle when set.
ARG VAPID_PUBLIC_KEY
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY
ENV VAPID_PUBLIC_KEY=${VAPID_PUBLIC_KEY}
ENV NEXT_PUBLIC_VAPID_PUBLIC_KEY=${NEXT_PUBLIC_VAPID_PUBLIC_KEY}

RUN if [ -n "$VAPID_PUBLIC_KEY" ] && [ -z "$NEXT_PUBLIC_VAPID_PUBLIC_KEY" ]; then \
      export NEXT_PUBLIC_VAPID_PUBLIC_KEY="$VAPID_PUBLIC_KEY"; \
    fi && \
    npm run build --workspace=@pkf/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV NEXT_PUBLIC_API_URL=/api
ENV API_GATEWAY_URL=http://127.0.0.1:4000
ENV API_GATEWAY_HOST=127.0.0.1:4000

RUN apk add --no-cache openssl libc6-compat

COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/packages ./packages
COPY --from=backend-builder /app/services ./services
COPY --from=backend-builder /app/package.json ./
COPY --from=web-builder /app/apps/web/.next/standalone ./
COPY --from=web-builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=web-builder /app/apps/web/public ./apps/web/public
COPY scripts/start-render.sh ./scripts/start-render.sh

RUN chmod +x ./scripts/start-render.sh

EXPOSE 3000

CMD ["./scripts/start-render.sh"]
