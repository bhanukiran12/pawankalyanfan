import crypto from "crypto";
import Razorpay from "razorpay";
import {
  createServiceApp,
  success,
  error,
  asyncHandler,
  authMiddleware,
  requireAdmin,
  optionalAuth,
  MEMBERSHIP,
  SERVICE_PORTS,
} from "@pkf/shared";
import { prisma } from "@pkf/database";

const app = createServiceApp("billing-service");

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay not configured");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// ─── Payments / Membership ────────────────────────────────
app.post("/payments/subscribe", authMiddleware, asyncHandler(async (req, res) => {
  const membership = await prisma.membership.upsert({
    where: { userId: req.user!.id },
    create: { userId: req.user!.id, status: "PENDING" },
    update: { status: "PENDING" },
  });

  success(res, {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    membershipId: membership.id,
    amount: MEMBERSHIP.amountPaise,
    planName: MEMBERSHIP.planName,
  });
}));

app.post("/payments/verify", authMiddleware, asyncHandler(async (req, res) => {
  const { paymentId, subscriptionId } = req.body;

  await prisma.membership.update({
    where: { userId: req.user!.id },
    data: {
      status: "ACTIVE",
      razorpaySubId: subscriptionId,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.user.update({
    where: { id: req.user!.id },
    data: { isPremium: true, premiumBadge: true },
  });

  await prisma.notification.create({
    data: {
      userId: req.user!.id,
      title: "Welcome to Premium!",
      message: "Your Premium Fan membership is now active.",
      type: "subscription",
    },
  });

  success(res, { success: true, paymentId });
}));

app.post("/payments/webhook", asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"] as string;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return error(res, "Webhook not configured", 500);

  const expected = crypto.createHmac("sha256", secret).update(JSON.stringify(req.body)).digest("hex");
  if (expected !== signature) return error(res, "Invalid signature", 401);

  if (req.body.event === "subscription.charged") {
    const subId = req.body.payload.subscription.entity.id;
    const membership = await prisma.membership.findFirst({ where: { razorpaySubId: subId } });
    if (membership) {
      await prisma.membership.update({
        where: { id: membership.id },
        data: { status: "ACTIVE", currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      });
    }
  }

  success(res, { received: true });
}));

// ─── Affiliate ────────────────────────────────────────────
app.get("/affiliate", asyncHandler(async (_req, res) => {
  const products = await prisma.affiliateProduct.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  success(res, products);
}));

app.post("/affiliate/click", optionalAuth, asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) return error(res, "Product ID required");

  const product = await prisma.affiliateProduct.findUnique({ where: { id: productId } });
  if (!product) return error(res, "Not found", 404);

  await prisma.$transaction([
    prisma.affiliateClick.create({
      data: {
        productId,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      },
    }),
    prisma.affiliateProduct.update({
      where: { id: productId },
      data: { clickCount: { increment: 1 } },
    }),
  ]);

  success(res, { redirectUrl: product.affiliateUrl });
}));

// ─── Ads ──────────────────────────────────────────────────
app.get("/ads/:slot", asyncHandler(async (req, res) => {
  const placement = await prisma.adPlacement.findFirst({ where: { slot: req.params.slot } });
  success(res, {
    enabled: placement?.enabled ?? false,
    adCode: placement?.adCode ?? null,
  });
}));

app.put("/ads/:slot", authMiddleware, requireAdmin, asyncHandler(async (req, res) => {
  const { enabled, adCode } = req.body;
  const ad = await prisma.adPlacement.upsert({
    where: { name: req.params.slot },
    create: { name: req.params.slot, slot: req.params.slot, enabled, adCode },
    update: { enabled, adCode },
  });
  success(res, ad);
}));

// ─── Admin billing stats ──────────────────────────────────
app.get("/admin/stats", authMiddleware, requireAdmin, asyncHandler(async (_req, res) => {
  const [premiumCount, activeMemberships, affiliateClicks, totalConversions] = await Promise.all([
    prisma.user.count({ where: { isPremium: true } }),
    prisma.membership.count({ where: { status: "ACTIVE" } }),
    prisma.affiliateClick.count(),
    prisma.affiliateClick.count({ where: { converted: true } }),
  ]);

  success(res, {
    premiumCount,
    subscriptionRevenue: activeMemberships * 99,
    affiliateClicks,
    totalConversions,
  });
}));

const PORT = process.env.PORT || SERVICE_PORTS.BILLING;
app.listen(PORT, () => console.log(`💳 Billing Service running on :${PORT}`));

export default app;
