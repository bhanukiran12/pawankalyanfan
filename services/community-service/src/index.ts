import {
  createServiceApp,
  success,
  error,
  asyncHandler,
  authMiddleware,
  requireAdmin,
  optionalAuth,
  newsletterSchema,
  forumThreadSchema,
  SERVICE_PORTS,
} from "@pkf/shared";
import { prisma } from "@pkf/database";

const app = createServiceApp("community-service");

// ─── Forum ────────────────────────────────────────────────
app.get("/forum", asyncHandler(async (req, res) => {
  const { categoryId, page = "1", limit = "20" } = req.query;
  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = categoryId;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const [threads, total, categories] = await Promise.all([
    prisma.forumThread.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      include: {
        user: { select: { name: true, image: true, isPremium: true, premiumBadge: true } },
        category: true,
        _count: { select: { replies: true, likes: true } },
      },
    }),
    prisma.forumThread.count({ where }),
    prisma.forumCategory.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  success(res, { threads, total, categories, page: pageNum });
}));

app.get("/forum/:slug", asyncHandler(async (req, res) => {
  const thread = await prisma.forumThread.findUnique({
    where: { slug: req.params.slug },
    include: {
      user: { select: { name: true, image: true, isPremium: true, premiumBadge: true } },
      category: true,
      replies: {
        include: { user: { select: { name: true, image: true, isPremium: true } } },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { likes: true } },
    },
  });
  if (!thread) return error(res, "Thread not found", 404);

  await prisma.forumThread.update({ where: { id: thread.id }, data: { viewCount: { increment: 1 } } });
  success(res, thread);
}));

app.post("/forum", authMiddleware, asyncHandler(async (req, res) => {
  const parsed = forumThreadSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.issues[0].message);

  const slug = parsed.data.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").slice(0, 80)
    + "-" + Date.now().toString(36);

  const thread = await prisma.forumThread.create({
    data: { ...parsed.data, slug, userId: req.user!.id },
    include: { category: true, user: { select: { name: true } } },
  });

  success(res, thread, 201);
}));

app.post("/forum/:id/like", authMiddleware, asyncHandler(async (req, res) => {
  await prisma.forumLike.upsert({
    where: { userId_threadId: { userId: req.user!.id, threadId: req.params.id } },
    create: { userId: req.user!.id, threadId: req.params.id },
    update: {},
  });
  success(res, { liked: true });
}));

// ─── Fan Edits ────────────────────────────────────────────
app.get("/fan-edits", asyncHandler(async (req, res) => {
  const { status = "APPROVED", page = "1", limit = "20" } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const [submissions, total] = await Promise.all([
    prisma.fanSubmission.findMany({
      where: { status: status as "APPROVED" | "PENDING" | "REJECTED" },
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      include: {
        user: { select: { name: true, image: true, isPremium: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.fanSubmission.count({ where: { status: status as "APPROVED" } }),
  ]);

  success(res, { submissions, total, page: pageNum });
}));

app.post("/fan-edits", authMiddleware, asyncHandler(async (req, res) => {
  const { title, description, mediaUrl, mediaType = "image" } = req.body;
  if (!title || !mediaUrl) return error(res, "Title and media URL required");

  const submission = await prisma.fanSubmission.create({
    data: { title, description, mediaUrl, mediaType, userId: req.user!.id },
  });

  success(res, submission, 201);
}));

app.put("/fan-edits/:id/approve", authMiddleware, requireAdmin, asyncHandler(async (req, res) => {
  await prisma.fanSubmission.update({ where: { id: req.params.id }, data: { status: "APPROVED" } });
  success(res, { approved: true });
}));

app.put("/fan-edits/:id/reject", authMiddleware, requireAdmin, asyncHandler(async (req, res) => {
  await prisma.fanSubmission.update({ where: { id: req.params.id }, data: { status: "REJECTED" } });
  success(res, { rejected: true });
}));

// ─── Newsletter ───────────────────────────────────────────
app.post("/newsletter", asyncHandler(async (req, res) => {
  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) return error(res, "Invalid email");

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    create: { email: parsed.data.email },
    update: { active: true },
  });

  success(res, { message: "Subscribed successfully!" });
}));

// ─── Admin community stats ────────────────────────────────
app.get("/admin/stats", authMiddleware, requireAdmin, asyncHandler(async (_req, res) => {
  const [submissionPending, threadCount, subscriberCount] = await Promise.all([
    prisma.fanSubmission.count({ where: { status: "PENDING" } }),
    prisma.forumThread.count(),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
  ]);
  success(res, { submissionPending, threadCount, subscriberCount });
}));

const PORT = process.env.PORT || SERVICE_PORTS.COMMUNITY;
app.listen(PORT, () => console.log(`👥 Community Service running on :${PORT}`));

export default app;
