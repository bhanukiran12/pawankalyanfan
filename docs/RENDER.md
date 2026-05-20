# Deploy on Render (one service)

This repo deploys as **one Docker web service** — backend microservices + API gateway + Next.js site in a single container.

| File | Role |
|------|------|
| `Dockerfile` | Full-stack image (use this on Render) |
| `scripts/start-render.sh` | Starts API on `:4000` internally, Next.js on Render `PORT` |
| `render.yaml` | Blueprint with one service: `pawankalyanfan` |

`Dockerfile.backend` / `Dockerfile.web` are only needed if you split API and web into two Render services later.

## Quick deploy

1. Push to GitHub.
2. Render → **New** → **Blueprint** → connect repo (or one **Web Service** → Docker → Dockerfile path: `Dockerfile`).
3. Set **Health Check Path** to `/` (not `/api/health`).
4. After deploy, open **Shell** on the service:

   ```bash
   npm run db:seed
   ```

5. Open your Render URL or custom domain (e.g. `https://pawankalyanfan.com`).

## How it works

```
Browser → Render PORT → Next.js (fan site)
              ↓ /api/*
         127.0.0.1:4000 → API gateway → microservices → Postgres
```

- **Public:** Next.js pages (Movies, Quotes, Blogs, …)
- **Internal:** Gateway `:4000`, services `:4001`–`:4005`

## Environment variables

| Variable | Value |
|----------|--------|
| `DATABASE_URL` / `DIRECT_URL` | From Render Postgres or Neon |
| `JWT_SECRET` | Auto-generated |
| `API_GATEWAY_URL` | `http://127.0.0.1:4000` (set in blueprint) |
| `NEXT_PUBLIC_API_URL` | `/api` |
| `NEXT_PUBLIC_SITE_URL` | Your public URL (`https://pawankalyanfan.com`) — set manually if the hostname-only value is wrong |

## Custom domain

Attach `pawankalyanfan.com` to **this one service** only. DNS CNAME → Render hostname for `pawankalyanfan`.

## Neon instead of Render Postgres

Remove the `databases` block in `render.yaml` and set `DATABASE_URL` + `DIRECT_URL` on the service.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| JSON “API gateway” on homepage | Old deploy used API-only image — redeploy with latest `Dockerfile` + `start-render.sh` |
| Empty Movies / Quotes | Run `npm run db:seed` in Shell; check logs for Prisma/OpenSSL errors |
| `/api/home` 404 | Redeploy; ensure `API_GATEWAY_URL=http://127.0.0.1:4000` |
| Prisma `libssl` error | Image includes OpenSSL 3 + `linux-musl-openssl-3.0.x` — redeploy latest commit |

## Health

- Site: `GET https://<your-host>/` → 200 HTML
- API (internal): only via `/api/health` through the site proxy → `GET https://<your-host>/api/health`
