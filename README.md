# PawanKalyanFan — Microservices Architecture

Production-ready fan media platform with **client-server separation** and **microservices**.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (apps/web)                         │
│              Next.js 14 — Pure Frontend                      │
│         Calls API Gateway via NEXT_PUBLIC_API_URL            │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / JWT
┌──────────────────────────▼──────────────────────────────────┐
│              API GATEWAY (services/api-gateway)                │
│                    Express — Port 4000                       │
│         Routes, auth validation, service aggregation         │
└──┬──────────┬──────────┬──────────┬──────────┬──────────────┘
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
┌──────┐ ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────┐
│ Auth │ │ Content │ │Community │ │Billing │ │  AI  │
│ 4001 │ │  4002   │ │   4003   │ │  4004  │ │ 4005 │
└──┬───┘ └────┬────┘ └────┬─────┘ └───┬────┘ └──┬───┘
   │          │          │           │         │
   └──────────┴──────────┴───────────┴─────────┘
                           │
              ┌────────────▼────────────┐
              │  PostgreSQL (Supabase)  │
              │   packages/database     │
              └─────────────────────────┘
```

## Services

| Service | Port | Responsibility |
|---------|------|----------------|
| **api-gateway** | 4000 | Single entry point, JWT passthrough, admin aggregation |
| **auth-service** | 4001 | Register, login, JWT, user management |
| **content-service** | 4002 | Movies, speeches, quotes, news, wallpapers, events |
| **community-service** | 4003 | Forum, fan edits, newsletter |
| **billing-service** | 4004 | Razorpay payments, affiliate, AdSense config |
| **ai-service** | 4005 | PK Fan AI chatbot |

## Shared Packages

| Package | Purpose |
|---------|---------|
| `@pkf/shared` | Constants, validations, JWT, Express middleware |
| `@pkf/database` | Prisma schema, client, seed data |

## Quick Start

```bash
# 1. Install all workspace dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Setup database
npm run db:push
npm run db:seed

# 4. Build shared packages
npm run build --workspace=@pkf/shared

# 5. Start all services (separate terminals or use turbo)
npm run dev
```

### Development (individual services)

```bash
# Terminal 1 — All backend services + gateway
npm run dev:services
npm run dev:gateway

# Terminal 2 — Frontend
npm run dev:web
```

### Docker

```bash
docker-compose up --build
```

## Environment Variables

See `.env.example`. Key variables:

- `DATABASE_URL` — PostgreSQL connection (shared by all services)
- `JWT_SECRET` — JWT signing secret (shared by gateway + services)
- `NEXT_PUBLIC_API_URL` — Gateway URL for web client (`http://localhost:4000/api`)

## API Routes (via Gateway)

| Route | Service |
|-------|---------|
| `POST /api/auth/register` | auth-service |
| `POST /api/auth/login` | auth-service |
| `GET /api/movies` | content-service |
| `GET /api/forum` | community-service |
| `POST /api/payments/subscribe` | billing-service |
| `POST /api/ai/chat` | ai-service |
| `GET /api/admin` | gateway (aggregated) |
| `GET /api/health` | gateway (all services health) |

## Project Structure

```
├── apps/web/                 # Next.js frontend (client only)
├── packages/
│   ├── shared/               # Shared types, JWT, middleware
│   └── database/             # Prisma ORM + seed
├── services/
│   ├── api-gateway/          # API Gateway
│   ├── auth-service/
│   ├── content-service/
│   ├── community-service/
│   ├── billing-service/
│   └── ai-service/
├── docker-compose.yml
└── turbo.json
```

## Deployment (Render + Docker)

Use the included [Render Blueprint](render.yaml):

| Service | Dockerfile | Description |
|---------|------------|-------------|
| `pawankalyanfan-api` | `Dockerfile.backend` | Gateway + all microservices in one container |
| `pawankalyanfan-web` | `Dockerfile.web` | Next.js standalone frontend |
| `pawankalyanfan-db` | — | Render PostgreSQL (or use Neon) |

**Steps:** Push to GitHub → Render Dashboard → **New** → **Blueprint** → connect repo → deploy → run `npm run db:seed` on the API service shell.

Full guide: [docs/RENDER.md](docs/RENDER.md)

> **Disclaimer:** This is an unofficial fan-created community and is not affiliated with or endorsed by Pawan Kalyan or any official organization.
