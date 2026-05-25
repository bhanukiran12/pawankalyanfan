#!/bin/sh
set -e

export AUTH_SERVICE_URL="${AUTH_SERVICE_URL:-http://127.0.0.1:4001}"
export CONTENT_SERVICE_URL="${CONTENT_SERVICE_URL:-http://127.0.0.1:4002}"
export COMMUNITY_SERVICE_URL="${COMMUNITY_SERVICE_URL:-http://127.0.0.1:4003}"
export BILLING_SERVICE_URL="${BILLING_SERVICE_URL:-http://127.0.0.1:4004}"
export AI_SERVICE_URL="${AI_SERVICE_URL:-http://127.0.0.1:4005}"
export CHARITY_SERVICE_URL="${CHARITY_SERVICE_URL:-http://127.0.0.1:4006}"

# Preserve Render's external PORT for the gateway (background jobs set their own PORT)
GATEWAY_PORT="${PORT:-4000}"

echo "Starting microservices..."

PORT=4001 node services/auth-service/dist/index.js &
PORT=4002 node services/content-service/dist/index.js &
PORT=4003 node services/community-service/dist/index.js &
PORT=4004 node services/billing-service/dist/index.js &
PORT=4005 node services/ai-service/dist/index.js &
PORT=4006 node services/charity-service/dist/index.js &

sleep 3
echo "Starting API gateway on port ${GATEWAY_PORT}..."
PORT="${GATEWAY_PORT}" exec node services/api-gateway/dist/index.js
