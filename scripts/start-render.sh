#!/bin/sh
set -e

# Render sets PORT to the public port — use it for Next.js, not the API gateway.
WEB_PORT="${PORT:-3000}"

export AUTH_SERVICE_URL="${AUTH_SERVICE_URL:-http://127.0.0.1:4001}"
export CONTENT_SERVICE_URL="${CONTENT_SERVICE_URL:-http://127.0.0.1:4002}"
export COMMUNITY_SERVICE_URL="${COMMUNITY_SERVICE_URL:-http://127.0.0.1:4003}"
export BILLING_SERVICE_URL="${BILLING_SERVICE_URL:-http://127.0.0.1:4004}"
export AI_SERVICE_URL="${AI_SERVICE_URL:-http://127.0.0.1:4005}"
export API_GATEWAY_URL="${API_GATEWAY_URL:-http://127.0.0.1:4000}"
export API_GATEWAY_HOST="${API_GATEWAY_HOST:-127.0.0.1:4000}"
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-/api}"

echo "Starting backend microservices..."
PORT=4001 node services/auth-service/dist/index.js &
PORT=4002 node services/content-service/dist/index.js &
PORT=4003 node services/community-service/dist/index.js &
PORT=4004 node services/billing-service/dist/index.js &
PORT=4005 node services/ai-service/dist/index.js &

sleep 2
echo "Starting API gateway on :4000..."
PORT=4000 node services/api-gateway/dist/index.js &

sleep 2
echo "Starting Next.js fan site on :${WEB_PORT}..."
PORT="${WEB_PORT}" exec node apps/web/server.js
