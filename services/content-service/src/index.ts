import {
  createServiceApp,
  success,
  error,
  asyncHandler,
  authMiddleware,
  requireAdmin,
  SERVICE_PORTS,
} from "@pkf/shared";
import { prisma } from "@pkf/database";
import { fetchJanasenaArticle } from "./janasena-news";
import { getJanasenaFeed, syncJanasenaNews, scheduleJanasenaPolling } from "./janasena-sync";
import {
  configureWebPush,
  getVapidPublicKey,
  isPushAvailable,
  savePushSubscription,
  removePushSubscription,
  type PushSubscriptionPayload,
} from "./push";
import { getPkBirthdayCountdown, buildPkBirthdayShare } from "./pk-birthday";

const app = createServiceApp("content-service");
configureWebPush();

// ─── Movies ───────────────────────────────────────────────
app.get("/movies", asyncHandler(async (req, res) => {
  const { year, genre, q, featured, page = "1", limit = "12" } = req.query;
  const where: Record<string, unknown> = { published: true };
  if (featured === "true") where.featured = true;
  if (genre) where.genre = { has: genre as string };
  if (year) {
    where.releaseDate = {
      gte: new Date(`${year}-01-01`),
      lte: new Date(`${year}-12-31`),
    };
  }
  if (q) {
    where.OR = [
      { title: { contains: q as string, mode: "insensitive" } },
      { synopsis: { contains: q as string, mode: "insensitive" } },
    ];
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      orderBy: { releaseDate: "desc" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      include: { _count: { select: { dialogues: true, songs: true } } },
    }),
    prisma.movie.count({ where }),
  ]);

  success(res, { movies, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
}));

app.get("/movies/:slug", asyncHandler(async (req, res) => {
  const movie = await prisma.movie.findUnique({
    where: { slug: req.params.slug, published: true },
    include: { cast: true, dialogues: true, songs: true, gallery: true },
  });
  if (!movie) return error(res, "Movie not found", 404);

  await prisma.movie.update({ where: { id: movie.id }, data: { viewCount: { increment: 1 } } });
  success(res, movie);
}));

// ─── Quotes ───────────────────────────────────────────────
app.get("/quotes", asyncHandler(async (req, res) => {
  const { category, featured, page = "1", limit = "20" } = req.query;
  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (featured === "true") where.featured = true;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const [quotes, total, movies] = await Promise.all([
    prisma.quote.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      include: {
        speech: { select: { slug: true, title: true } },
      },
    }),
    prisma.quote.count({ where }),
    prisma.movie.findMany({ select: { title: true, slug: true }, where: { published: true } }),
  ]);

  const movieSlugByTitle = new Map(
    movies.map((m) => [m.title.toLowerCase(), m.slug]),
  );

  const enriched = quotes.map((q) => {
    const { speech, ...rest } = q;
    const movieSlug = q.movieTitle
      ? movieSlugByTitle.get(q.movieTitle.toLowerCase()) ?? null
      : null;
    return {
      ...rest,
      movieSlug,
      speechSlug: speech?.slug ?? null,
    };
  });

  success(res, { quotes: enriched, total, page: pageNum });
}));

// ─── News ─────────────────────────────────────────────────
app.get("/news", asyncHandler(async (req, res) => {
  const { category, trending, page = "1", limit = "12", excludeCategory } = req.query;
  const where: Record<string, unknown> = { published: true };
  if (category) where.category = category;
  if (excludeCategory) where.category = { not: excludeCategory as string };
  if (trending === "true") where.trending = true;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const [posts, total] = await Promise.all([
    prisma.newsPost.findMany({
      where,
      orderBy: [{ trending: "desc" }, { publishedAt: "desc" }],
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
    prisma.newsPost.count({ where }),
  ]);

  success(res, { posts, total, page: pageNum });
}));

app.get("/news/:slug", asyncHandler(async (req, res) => {
  const post = await prisma.newsPost.findUnique({
    where: { slug: req.params.slug, published: true },
  });
  if (!post) return error(res, "Post not found", 404);
  success(res, post);
}));

// ─── Wallpapers ───────────────────────────────────────────
app.get("/wallpapers", asyncHandler(async (req, res) => {
  const { tag, q, page = "1", limit = "20" } = req.query;
  const where: Record<string, unknown> = { published: true };
  if (tag) where.tags = { has: tag as string };
  if (q && typeof q === "string" && q.trim()) {
    const term = q.trim();
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { slug: { contains: term, mode: "insensitive" } },
      { tags: { has: term.toLowerCase() } },
    ];
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const [wallpapers, total] = await Promise.all([
    prisma.wallpaper.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
    prisma.wallpaper.count({ where }),
  ]);

  success(res, { wallpapers, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
}));

// ─── Events ───────────────────────────────────────────────
app.get("/events", asyncHandler(async (req, res) => {
  const { type } = req.query;
  const where: Record<string, unknown> = {};
  if (type) where.type = type;

  const events = await prisma.timelineEvent.findMany({
    where,
    orderBy: { date: "desc" },
    include: {
      movie: { select: { title: true, slug: true, posterUrl: true } },
    },
  });

  success(res, events);
}));

// ─── Home feed (aggregated) ───────────────────────────────
app.get("/home", asyncHandler(async (_req, res) => {
  const [movies, quotes, news, wallpapers, events, submissions] = await Promise.all([
    prisma.movie.findMany({ where: { published: true, featured: true }, take: 12, orderBy: { releaseDate: "desc" } }),
    prisma.quote.findMany({ where: { featured: true }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.newsPost.findMany({
      where: { published: true, category: "Blog" },
      take: 4,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.wallpaper.findMany({ where: { published: true }, take: 6, orderBy: { createdAt: "desc" } }),
    prisma.timelineEvent.findMany({ where: { featured: true }, take: 5, orderBy: { date: "desc" } }),
    prisma.fanSubmission.findMany({
      where: { status: "APPROVED" }, take: 6, orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
  ]);

  success(res, { movies, quotes, news, wallpapers, events, submissions });
}));

// ─── Jana Sena newsletter (janasenanewsletter.com) ────────
app.get("/janasena-news", asyncHandler(async (_req, res) => {
  await syncJanasenaNews().catch(() => undefined);
  const articles = await getJanasenaFeed();
  success(res, { articles, source: "https://janasenanewsletter.com/news" });
}));

app.get("/janasena-news/:id", asyncHandler(async (req, res) => {
  const article = await fetchJanasenaArticle(req.params.id);
  if (!article) return error(res, "Article not found", 404);
  success(res, article);
}));

// ─── Web push (browser notifications) ─────────────────────
app.get("/push/vapid-public-key", asyncHandler(async (_req, res) => {
  if (!isPushAvailable()) return error(res, "Push notifications are not configured", 503);
  success(res, { publicKey: getVapidPublicKey() });
}));

app.post("/push/subscribe", asyncHandler(async (req, res) => {
  const sub = req.body as PushSubscriptionPayload;
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return error(res, "Invalid subscription");
  }
  if (!isPushAvailable()) return error(res, "Push notifications are not configured", 503);
  await savePushSubscription(sub);
  success(res, { subscribed: true });
}));

app.post("/push/unsubscribe", asyncHandler(async (req, res) => {
  const { endpoint } = req.body as { endpoint?: string };
  if (endpoint) await removePushSubscription(endpoint);
  success(res, { unsubscribed: true });
}));

// ─── Admin content CRUD ───────────────────────────────────
app.post("/admin/movies", authMiddleware, requireAdmin, asyncHandler(async (req, res) => {
  const movie = await prisma.movie.create({ data: req.body });
  success(res, movie, 201);
}));

app.put("/admin/movies/:id", authMiddleware, requireAdmin, asyncHandler(async (req, res) => {
  const movie = await prisma.movie.update({ where: { id: req.params.id }, data: req.body });
  success(res, movie);
}));

app.delete("/admin/movies/:id", authMiddleware, requireAdmin, asyncHandler(async (req, res) => {
  await prisma.movie.delete({ where: { id: req.params.id } });
  success(res, { deleted: true });
}));

// ─── PK Birthday countdown (footer / social share) ─────────
app.get("/pk-birthday/countdown", asyncHandler(async (_req, res) => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://pawankalyanfan.com";
  const countdown = getPkBirthdayCountdown(new Date());
  const share = buildPkBirthdayShare(siteUrl, countdown);
  success(res, { countdown, share, updatedAt: new Date().toISOString() });
}));

app.get("/admin/stats", authMiddleware, requireAdmin, asyncHandler(async (_req, res) => {
  const [movieCount, quoteCount, topMovies] = await Promise.all([
    prisma.movie.count(),
    prisma.quote.count(),
    prisma.movie.findMany({ take: 5, orderBy: { viewCount: "desc" }, select: { id: true, title: true, viewCount: true } }),
  ]);
  success(res, { movieCount, quoteCount, topMovies });
}));

const PORT = process.env.PORT || SERVICE_PORTS.CONTENT;
app.listen(PORT, () => {
  console.log(`🎬 Content Service running on :${PORT}`);
  scheduleJanasenaPolling();
});

export default app;
