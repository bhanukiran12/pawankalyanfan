import express from "express";
import type { ClientRequest } from "http";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import {
  createServiceApp,
  success,
  authMiddleware,
  SERVICE_PORTS,
  SERVICE_URLS,
} from "@pkf/shared";

const app = createServiceApp("api-gateway");

/** express.json() consumes the body; re-stream it for proxied POST/PUT/PATCH requests */
function restreamBody(proxyReq: ClientRequest, req: express.Request) {
  if (!req.body || !Object.keys(req.body).length) return;
  const bodyData = JSON.stringify(req.body);
  proxyReq.setHeader("Content-Type", "application/json");
  proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
  proxyReq.write(bodyData);
}

function proxy(target: string, pathRewrite?: Record<string, string>): Options {
  return {
    target,
    changeOrigin: true,
    pathRewrite,
    on: {
      proxyReq: (proxyReq, req) => {
        restreamBody(proxyReq, req as express.Request);
      },
      error: (err, _req, res) => {
        console.error(`Proxy error [${target}]:`, err.message);
        if ("writeHead" in res) {
          (res as express.Response).status(503).json({
            success: false,
            error: "Service temporarily unavailable",
          });
        }
      },
    },
  };
}

/** Express mount strips the prefix; rewrite relative path to the service route. */
function mountedProxy(target: string, servicePath: string): Options {
  return {
    ...proxy(target),
    pathRewrite: (path) => `${servicePath}${path === "/" ? "" : path}`,
  };
}

// ─── Auth Service ─────────────────────────────────────────
app.use("/api/auth", createProxyMiddleware(mountedProxy(SERVICE_URLS.AUTH, "")));

// ─── Content Service ──────────────────────────────────────
app.use("/api/movies", createProxyMiddleware(mountedProxy(SERVICE_URLS.CONTENT, "/movies")));
app.use("/api/quotes", createProxyMiddleware(mountedProxy(SERVICE_URLS.CONTENT, "/quotes")));
app.use("/api/news", createProxyMiddleware(mountedProxy(SERVICE_URLS.CONTENT, "/news")));
app.use("/api/wallpapers", createProxyMiddleware(mountedProxy(SERVICE_URLS.CONTENT, "/wallpapers")));
app.use("/api/events", createProxyMiddleware(mountedProxy(SERVICE_URLS.CONTENT, "/events")));
app.use("/api/home", createProxyMiddleware(mountedProxy(SERVICE_URLS.CONTENT, "/home")));
app.use("/api/janasena-news", createProxyMiddleware(mountedProxy(SERVICE_URLS.CONTENT, "/janasena-news")));
app.use("/api/push", createProxyMiddleware(mountedProxy(SERVICE_URLS.CONTENT, "/push")));

// ─── Community Service ────────────────────────────────────
app.use("/api/forum", createProxyMiddleware(mountedProxy(SERVICE_URLS.COMMUNITY, "/forum")));
app.use("/api/fan-edits", createProxyMiddleware(mountedProxy(SERVICE_URLS.COMMUNITY, "/fan-edits")));
app.use("/api/newsletter", createProxyMiddleware(mountedProxy(SERVICE_URLS.COMMUNITY, "/newsletter")));

// ─── Billing Service ──────────────────────────────────────
app.use("/api/payments", createProxyMiddleware(proxy(SERVICE_URLS.BILLING, { "^/api/payments": "/payments" })));
app.use("/api/affiliate", createProxyMiddleware(proxy(SERVICE_URLS.BILLING, { "^/api/affiliate": "/affiliate" })));
app.use("/api/ads", createProxyMiddleware(proxy(SERVICE_URLS.BILLING, { "^/api/ads": "/ads" })));

// ─── AI Service ───────────────────────────────────────────
app.use("/api/ai", createProxyMiddleware(proxy(SERVICE_URLS.AI, { "^/api/ai": "" })));

// ─── Aggregated Admin Dashboard ───────────────────────────
app.get("/api/admin", authMiddleware, async (req, res) => {
  try {
    const headers = { Authorization: req.headers.authorization || "" };
    const [authRes, contentRes, communityRes, billingRes] = await Promise.all([
      fetch(`${SERVICE_URLS.AUTH}/users`, { headers }),
      fetch(`${SERVICE_URLS.CONTENT}/admin/stats`, { headers }),
      fetch(`${SERVICE_URLS.COMMUNITY}/admin/stats`, { headers }),
      fetch(`${SERVICE_URLS.BILLING}/admin/stats`, { headers }),
    ]);

    const [users, content, community, billing] = await Promise.all([
      authRes.json(),
      contentRes.json(),
      communityRes.json(),
      billingRes.json(),
    ]);

    success(res, {
      stats: {
        userCount: users.data?.length ?? 0,
        premiumCount: billing.data?.premiumCount ?? 0,
        movieCount: content.data?.movieCount ?? 0,
        quoteCount: content.data?.quoteCount ?? 0,
        submissionPending: community.data?.submissionPending ?? 0,
        subscriptionRevenue: billing.data?.subscriptionRevenue ?? 0,
        affiliateClicks: billing.data?.affiliateClicks ?? 0,
      },
      recentUsers: users.data?.slice(0, 5) ?? [],
      topMovies: content.data?.topMovies ?? [],
    });
  } catch (err) {
    console.error("Admin aggregation error:", err);
    res.status(500).json({ success: false, error: "Failed to aggregate admin data" });
  }
});

app.get("/", (_req, res) => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.PUBLIC_WEB_URL ||
    process.env.WEB_URL;
  if (siteUrl) {
    const target = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
    res.redirect(302, target);
    return;
  }
  res.json({
    success: true,
    message: "PawanKalyanFan API gateway",
    health: "/api/health",
    hint: "Point your custom domain at the pawankalyanfan-web service, not this API service.",
  });
});

// ─── Gateway health (all services) ────────────────────────
app.get("/api/health", async (_req, res) => {
  const services = [
    { name: "auth", url: SERVICE_URLS.AUTH },
    { name: "content", url: SERVICE_URLS.CONTENT },
    { name: "community", url: SERVICE_URLS.COMMUNITY },
    { name: "billing", url: SERVICE_URLS.BILLING },
    { name: "ai", url: SERVICE_URLS.AI },
  ];

  const results = await Promise.all(
    services.map(async (s) => {
      try {
        const r = await fetch(`${s.url}/health`, { signal: AbortSignal.timeout(3000) });
        const data = await r.json();
        return { ...s, status: data.data?.status ?? "ok" };
      } catch {
        return { ...s, status: "error" };
      }
    })
  );

  success(res, { gateway: "ok", services: results, timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || SERVICE_PORTS.GATEWAY;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on :${PORT}`);
  console.log(`   Auth      → ${SERVICE_URLS.AUTH}`);
  console.log(`   Content   → ${SERVICE_URLS.CONTENT}`);
  console.log(`   Community → ${SERVICE_URLS.COMMUNITY}`);
  console.log(`   Billing   → ${SERVICE_URLS.BILLING}`);
  console.log(`   AI        → ${SERVICE_URLS.AI}`);
});

export default app;
