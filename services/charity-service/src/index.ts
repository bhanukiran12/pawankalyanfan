import {
  createServiceApp,
  success,
  error,
  asyncHandler,
  authMiddleware,
  requireAdmin,
  optionalAuth,
} from "@pkf/shared";
import { prisma } from "@pkf/database";
import { makeSlug, urgencyWeight } from "./lib/utils";
import {
  buildSuccessStoryShare,
  normalizeHashtags,
  SEVA_TYPE_LABELS,
} from "./lib/success-story-share";
import { createEmailOtp, verifyEmailOtp } from "./lib/otp";
import { logOtpEmailConfig, sendJanaSevaOtpEmail } from "./lib/send-otp-email";
import {
  saveVolunteerPushSubscription,
  scheduleVolunteerHelpAlert,
  upsertVolunteerAlertPrefs,
} from "./lib/volunteer-alerts";
import { isVolunteerPushAvailable } from "./lib/volunteer-push";
import { requireJanaSevaEmail, VERIFIED_POST } from "./lib/email-verified";

const app = createServiceApp("charity-service");

const OPEN_STATUSES = ["OPEN"] as const;

async function expireListings() {
  const now = new Date();
  await Promise.all([
    prisma.bloodRequest.updateMany({
      where: { status: "OPEN", expiresAt: { lt: now } },
      data: { status: "EXPIRED" },
    }),
    prisma.emergencyPost.updateMany({
      where: { status: "OPEN", expiresAt: { lt: now } },
      data: { status: "EXPIRED" },
    }),
  ]);
}

// ─── Platform stats ───────────────────────────────────────
app.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    await expireListings();
    const [bloodActive, camps, workshops, volunteers, fulfilled, emergencies, stories] = await Promise.all([
      prisma.bloodRequest.count({ where: { status: { in: [...OPEN_STATUSES] } } }),
      prisma.bloodCamp.count({ where: { status: "OPEN" } }),
      prisma.workshop.count({ where: { status: "OPEN" } }),
      prisma.charityProfile.count(),
      prisma.bloodRequest.count({ where: { status: "FULFILLED" } }),
      prisma.emergencyPost.count({ where: { status: "OPEN" } }),
      prisma.janaSevaSuccessStory.count({ where: { status: "OPEN" } }),
    ]);
    success(res, {
      activeBloodRequests: bloodActive,
      bloodCamps: camps,
      workshops,
      volunteers,
      peopleHelped: fulfilled + volunteers * 2 + stories,
      activeEmergencies: emergencies,
      successStories: stories,
    });
  }),
);

// ─── Email OTP (required to post) ─────────────────────────
app.post(
  "/otp/send",
  asyncHandler(async (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return error(res, "Valid email required");
    }
    const recent = await prisma.janaSevaEmailOtp.count({
      where: { email, createdAt: { gte: new Date(Date.now() - 60_000) } },
    });
    if (recent > 0) return error(res, "Wait a minute before requesting another code.", 429);

    const { code, expiresAt } = await createEmailOtp(email);
    const emailResult = await sendJanaSevaOtpEmail(email, code);
    const isDev = process.env.NODE_ENV !== "production";
    const forceDevFallback = process.env.JANA_SEVA_OTP_DEV_FALLBACK === "true";
    const allowDevFallback = isDev && process.env.JANA_SEVA_OTP_DEV_FALLBACK !== "false";

    if (emailResult.ok) {
      console.log(`[Jana Seva OTP] Sent to ${email}`);
    } else if (allowDevFallback || forceDevFallback) {
      console.log(`[Jana Seva OTP] ${email} → ${code} (${emailResult.error})`);
    } else {
      return error(res, emailResult.error || "Could not send OTP email. Try again later.", 503);
    }

    success(res, {
      sent: true,
      expiresAt,
      message: emailResult.ok
        ? "OTP sent to your email. Check inbox and spam."
        : "Email not configured — use the code shown below (dev only).",
      ...(!emailResult.ok && (allowDevFallback || forceDevFallback) ? { devCode: code } : {}),
    });
  }),
);

app.post(
  "/otp/verify",
  asyncHandler(async (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const code = String(req.body?.code || "").trim();
    if (!email || !code) return error(res, "Email and OTP code required");

    const session = await verifyEmailOtp(email, code);
    if (!session) return error(res, "Invalid or expired OTP", 401);

    success(res, {
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt,
      email,
    });
  }),
);

// ─── Blood requests ───────────────────────────────────────
app.get(
  "/blood-requests",
  asyncHandler(async (req, res) => {
    await expireListings();
    const { city, bloodGroup, urgency, page = "1", limit = "20", near } = req.query;
    const where: Record<string, unknown> = { status: { in: [...OPEN_STATUSES] } };
    if (city && typeof city === "string") where.city = { contains: city, mode: "insensitive" };
    if (bloodGroup && typeof bloodGroup === "string") where.bloodGroup = bloodGroup;
    if (urgency && typeof urgency === "string") where.urgency = urgency;

    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(parseInt(limit as string, 10) || 20, 50);

    let rows = await prisma.bloodRequest.findMany({
      where,
      orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    rows = rows.sort((a, b) => urgencyWeight(b.urgency) - urgencyWeight(a.urgency));
    const total = await prisma.bloodRequest.count({ where });
    success(res, {
      requests: rows,
      total,
      page: pageNum,
      near: near === "true",
    });
  }),
);

app.get(
  "/blood-requests/:slug",
  asyncHandler(async (req, res) => {
    const row = await prisma.bloodRequest.findUnique({ where: { slug: req.params.slug } });
    if (!row) return error(res, "Request not found", 404);
    await prisma.bloodRequest.update({
      where: { id: row.id },
      data: { viewCount: { increment: 1 } },
    });
    success(res, row);
  }),
);

app.post(
  "/blood-requests",
  requireJanaSevaEmail,
  optionalAuth,
  asyncHandler(async (req, res) => {
    const b = req.body;
    if (!b.hospitalName || !b.city || !b.state || !b.bloodGroup || !b.phone || !b.consentGiven) {
      return error(res, "Missing required fields");
    }
    const expiresAt = b.expiresAt ? new Date(b.expiresAt) : new Date(Date.now() + 7 * 86400000);

    const duplicate = await prisma.bloodRequest.findFirst({
      where: {
        hospitalName: b.hospitalName,
        bloodGroup: b.bloodGroup,
        city: b.city,
        status: "OPEN",
        createdAt: { gte: new Date(Date.now() - 86400000) },
      },
    });
    if (duplicate) return error(res, "Similar request posted recently. Please update existing listing.", 409);

    const slug = makeSlug(`${b.city}-${b.bloodGroup}-blood`);
    const created = await prisma.bloodRequest.create({
      data: {
        slug,
        patientName: b.anonymous ? "Anonymous" : b.patientName,
        patientAge: b.patientAge ? parseInt(String(b.patientAge), 10) : null,
        hospitalName: b.hospitalName,
        hospitalAddress: b.hospitalAddress || b.hospitalName,
        city: b.city,
        state: b.state,
        bloodGroup: b.bloodGroup,
        unitsRequired: b.unitsRequired ? parseInt(String(b.unitsRequired), 10) : 1,
        urgency: b.urgency || "NORMAL",
        doctorNoteUrl: b.doctorNoteUrl || null,
        phone: String(b.phone),
        alternatePhone: b.alternatePhone || null,
        whatsapp: b.whatsapp || b.phone,
        expiresAt,
        anonymous: !!b.anonymous,
        consentGiven: true,
        userId: req.user?.id,
        ...VERIFIED_POST,
      },
    });
    scheduleVolunteerHelpAlert({
      kind: "BLOOD",
      title: `Blood needed: ${b.bloodGroup} in ${b.city}`,
      summary: `${b.hospitalName} — ${b.urgency || "NORMAL"} urgency`,
      urlPath: `/jana-seva/blood/${slug}`,
      city: String(b.city),
      state: b.state,
      tagId: created.id,
    });
    success(res, created, 201);
  }),
);

app.patch(
  "/blood-requests/:id/fulfill",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const updated = await prisma.bloodRequest.update({
      where: { id: req.params.id },
      data: { status: "FULFILLED", fulfilledAt: new Date() },
    });
    success(res, updated);
  }),
);

// ─── Blood camps ──────────────────────────────────────────
app.get(
  "/blood-camps",
  asyncHandler(async (req, res) => {
    const { city, page = "1", limit = "20" } = req.query;
    const where: Record<string, unknown> = { status: "OPEN" };
    if (city) where.city = { contains: city as string, mode: "insensitive" };
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10) || 20;
    const [camps, total] = await Promise.all([
      prisma.bloodCamp.findMany({
        where,
        orderBy: { campDate: "asc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.bloodCamp.count({ where }),
    ]);
    success(res, { camps, total, page: pageNum });
  }),
);

app.post(
  "/blood-camps",
  requireJanaSevaEmail,
  optionalAuth,
  asyncHandler(async (req, res) => {
    const b = req.body;
    if (!b.title || !b.organizerName || !b.city || !b.campDate || !b.phone) {
      return error(res, "Missing required fields");
    }
    const campSlug = makeSlug(b.title);
    const created = await prisma.bloodCamp.create({
      data: {
        slug: campSlug,
        title: b.title,
        organizerName: b.organizerName,
        organization: b.organization,
        address: b.address || "",
        city: b.city,
        state: b.state || "Andhra Pradesh",
        latitude: b.latitude,
        longitude: b.longitude,
        campDate: new Date(b.campDate),
        campTime: b.campTime || "09:00",
        phone: String(b.phone),
        registrationUrl: b.registrationUrl,
        description: b.description || "",
        posterUrl: b.posterUrl,
        userId: req.user?.id,
        ...VERIFIED_POST,
      },
    });
    scheduleVolunteerHelpAlert({
      kind: "CAMP",
      title: `Blood camp: ${b.title}`,
      summary: `${b.organizerName} · ${b.city}`,
      urlPath: `/jana-seva/camps`,
      city: String(b.city),
      state: b.state,
      tagId: created.id,
    });
    success(res, created, 201);
  }),
);

// ─── Workshops ──────────────────────────────────────────────
app.get(
  "/workshops",
  asyncHandler(async (req, res) => {
    const { category, city, page = "1", limit = "20" } = req.query;
    const where: Record<string, unknown> = { status: "OPEN" };
    if (category) where.category = category;
    if (city) where.city = { contains: city as string, mode: "insensitive" };
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10) || 20;
    const [items, total] = await Promise.all([
      prisma.workshop.findMany({
        where,
        orderBy: [{ trending: "desc" }, { workshopDate: "asc" }],
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.workshop.count({ where }),
    ]);
    success(res, { workshops: items, total, page: pageNum });
  }),
);

app.post(
  "/workshops",
  requireJanaSevaEmail,
  optionalAuth,
  asyncHandler(async (req, res) => {
    const b = req.body;
    if (!b.title || !b.speaker || !b.category || !b.workshopDate) {
      return error(res, "Missing required fields");
    }
    const created = await prisma.workshop.create({
      data: {
        slug: makeSlug(b.title),
        title: b.title,
        speaker: b.speaker,
        organization: b.organization,
        category: b.category,
        mode: b.mode || "ONLINE",
        city: b.city,
        workshopDate: new Date(b.workshopDate),
        workshopTime: b.workshopTime || "10:00",
        capacity: b.capacity,
        registrationUrl: b.registrationUrl,
        whatsappGroupUrl: b.whatsappGroupUrl,
        posterUrl: b.posterUrl,
        certificateAvailable: !!b.certificateAvailable,
        isFree: b.isFree !== false,
        description: b.description || "",
        userId: req.user?.id,
        ...VERIFIED_POST,
      },
    });
    success(res, created, 201);
  }),
);

// ─── Scholarships ─────────────────────────────────────────
app.get(
  "/scholarships",
  asyncHandler(async (req, res) => {
    const { category, q, page = "1", limit = "20" } = req.query;
    const where: Record<string, unknown> = { status: "OPEN" };
    if (category) where.category = category;
    if (q) where.title = { contains: q as string, mode: "insensitive" };
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10) || 20;
    const [items, total] = await Promise.all([
      prisma.scholarship.findMany({
        where,
        orderBy: { deadline: "asc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.scholarship.count({ where }),
    ]);
    success(res, { scholarships: items, total, page: pageNum });
  }),
);

app.post(
  "/scholarships",
  requireJanaSevaEmail,
  optionalAuth,
  asyncHandler(async (req, res) => {
    const b = req.body;
    if (!b.title || !b.provider || !b.deadline || !b.applicationUrl) {
      return error(res, "Missing required fields");
    }
    const created = await prisma.scholarship.create({
      data: {
        slug: makeSlug(b.title),
        title: b.title,
        provider: b.provider,
        amount: b.amount,
        eligibility: b.eligibility || "",
        deadline: new Date(b.deadline),
        applicationUrl: b.applicationUrl,
        category: b.category || "scholarships",
        documentsRequired: b.documentsRequired,
        description: b.description || "",
        userId: req.user?.id,
        ...VERIFIED_POST,
      },
    });
    success(res, created, 201);
  }),
);

// ─── Volunteers ─────────────────────────────────────────────
app.get(
  "/volunteers",
  asyncHandler(async (req, res) => {
    const { city, bloodDonor, page = "1", limit = "24" } = req.query;
    const where: Record<string, unknown> = {};
    if (city) where.city = { contains: city as string, mode: "insensitive" };
    if (bloodDonor === "true") where.isBloodDonor = true;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10) || 24;
    const [items, total] = await Promise.all([
      prisma.charityProfile.findMany({
        where,
        orderBy: { contributionScore: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.charityProfile.count({ where }),
    ]);
    success(res, { volunteers: items, total, page: pageNum });
  }),
);

app.post(
  "/volunteers/register",
  requireJanaSevaEmail,
  optionalAuth,
  asyncHandler(async (req, res) => {
    const b = req.body;
    if (!b.displayName || !b.city || !b.state) return error(res, "Missing required fields");

    const existing = await prisma.charityProfile.findFirst({
      where: { contactEmail: req.janaSevaEmail! },
    });
    if (existing) return error(res, "This email is already registered as a Jana Seva volunteer.", 409);

    const created = await prisma.charityProfile.create({
      data: {
        userId: req.user?.id,
        displayName: b.displayName,
        contactEmail: req.janaSevaEmail!,
        city: b.city,
        state: b.state,
        phone: b.phone ? String(b.phone) : null,
        skills: Array.isArray(b.skills) ? b.skills : b.skills ? String(b.skills).split(",").map((s: string) => s.trim()) : [],
        isBloodDonor: !!b.isBloodDonor,
        isWorkshopMentor: !!b.isWorkshopMentor,
        isEventVolunteer: !!b.isEventVolunteer,
        offersTransport: !!b.offersTransport,
        isEmergencyResponder: !!b.isEmergencyResponder,
        availability: b.availability,
        profileImage: b.profileImage,
        ...VERIFIED_POST,
      },
    });
    await upsertVolunteerAlertPrefs(req.janaSevaEmail!, created.id, {
      city: b.city,
      state: b.state,
      emailAlertsEnabled: b.emailAlertsEnabled !== false,
      pushAlertsEnabled: b.pushAlertsEnabled !== false,
      notifyBlood: b.notifyBlood !== false,
      notifyEmergency: b.notifyEmergency !== false,
      notifyCamps: b.notifyCamps !== false,
      notifyEducation: b.notifyEducation !== false,
    });
    success(res, created, 201);
  }),
);

// ─── Volunteer help alerts (email + browser) ────────────────
app.get(
  "/alerts/me",
  requireJanaSevaEmail,
  asyncHandler(async (req, res) => {
    const row = await prisma.janaSevaVolunteerAlert.findUnique({
      where: { email: req.janaSevaEmail! },
    });
    const profile = await prisma.charityProfile.findFirst({
      where: { contactEmail: req.janaSevaEmail! },
    });
    success(res, {
      registered: !!profile,
      pushAvailable: isVolunteerPushAvailable(),
      hasPushSubscription: !!row?.pushEndpoint,
      preferences: row ?? null,
    });
  }),
);

app.patch(
  "/alerts/me",
  requireJanaSevaEmail,
  asyncHandler(async (req, res) => {
    const profile = await prisma.charityProfile.findFirst({
      where: { contactEmail: req.janaSevaEmail! },
    });
    if (!profile) return error(res, "Register as a volunteer first", 403);
    const b = req.body;
    const updated = await upsertVolunteerAlertPrefs(req.janaSevaEmail!, profile.id, {
      city: b.city ?? profile.city,
      state: b.state ?? profile.state,
      emailAlertsEnabled: b.emailAlertsEnabled,
      pushAlertsEnabled: b.pushAlertsEnabled,
      notifyBlood: b.notifyBlood,
      notifyEmergency: b.notifyEmergency,
      notifyCamps: b.notifyCamps,
      notifyEducation: b.notifyEducation,
    });
    success(res, updated);
  }),
);

app.post(
  "/alerts/push-subscribe",
  requireJanaSevaEmail,
  asyncHandler(async (req, res) => {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return error(res, "Push subscription endpoint and keys required");
    }
    if (!isVolunteerPushAvailable()) {
      return error(res, "Browser push is not configured on the server (VAPID keys)", 503);
    }
    try {
      const row = await saveVolunteerPushSubscription(req.janaSevaEmail!, { endpoint, keys });
      success(res, { subscribed: true, preferences: row });
    } catch (e) {
      return error(res, e instanceof Error ? e.message : "Subscribe failed", 403);
    }
  }),
);

// ─── Emergency board ────────────────────────────────────────
app.get(
  "/emergency",
  asyncHandler(async (req, res) => {
    await expireListings();
    const { city, category, page = "1", limit = "15" } = req.query;
    const where: Record<string, unknown> = { status: "OPEN" };
    if (city) where.city = { contains: city as string, mode: "insensitive" };
    if (category) where.category = category;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10) || 15;
    const [items, total] = await Promise.all([
      prisma.emergencyPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.emergencyPost.count({ where }),
    ]);
    success(res, { posts: items, total, page: pageNum });
  }),
);

app.post(
  "/emergency",
  requireJanaSevaEmail,
  optionalAuth,
  asyncHandler(async (req, res) => {
    const b = req.body;
    if (!b.title || !b.category || !b.description || !b.city || !b.phone) {
      return error(res, "Missing required fields");
    }
    const expiresAt = b.expiresAt ? new Date(b.expiresAt) : new Date(Date.now() + 3 * 86400000);
    const emSlug = makeSlug(b.title);
    const isEducation =
      String(b.title).startsWith("[Education]") || b.category === "URGENT_ASSISTANCE";
    const created = await prisma.emergencyPost.create({
      data: {
        slug: emSlug,
        title: b.title,
        category: b.category,
        description: b.description,
        city: b.city,
        state: b.state || "Andhra Pradesh",
        phone: String(b.phone),
        expiresAt,
        userId: req.user?.id,
        ...VERIFIED_POST,
      },
    });
    scheduleVolunteerHelpAlert({
      kind: isEducation ? "EDUCATION" : "EMERGENCY",
      title: b.title,
      summary: String(b.description).slice(0, 200),
      urlPath: `/jana-seva/emergency`,
      city: String(b.city),
      state: b.state,
      tagId: created.id,
    });
    success(res, created, 201);
  }),
);

// ─── Volunteer success stories (community feed + social share) ─
function siteUrlFromEnv() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://pawankalyanfan.com";
  return raw.startsWith("http") ? raw : `https://${raw}`;
}

function storyPublic(row: {
  id: string;
  slug: string;
  volunteerName: string;
  sevaType: string;
  caption: string;
  helpedDisplay: string;
  photoUrls: string[];
  hashtags: string[];
  city: string | null;
  state: string | null;
  viewCount: number;
  createdAt: Date;
}) {
  const sevaTypeLabel = SEVA_TYPE_LABELS[row.sevaType] ?? row.sevaType;
  return {
    ...row,
    sevaTypeLabel,
    share: buildSuccessStoryShare(siteUrlFromEnv(), {
      slug: row.slug,
      caption: row.caption,
      helpedDisplay: row.helpedDisplay,
      volunteerName: row.volunteerName,
      sevaTypeLabel,
      hashtags: row.hashtags,
    }),
  };
}

app.get(
  "/success-stories",
  asyncHandler(async (req, res) => {
    const { sevaType, page = "1", limit = "12" } = req.query;
    const where: Record<string, unknown> = { status: "OPEN" };
    if (sevaType && typeof sevaType === "string") where.sevaType = sevaType;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = Math.min(parseInt(limit as string, 10) || 12, 30);
    const [rows, total] = await Promise.all([
      prisma.janaSevaSuccessStory.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.janaSevaSuccessStory.count({ where }),
    ]);
    success(res, {
      stories: rows.map(storyPublic),
      total,
      page: pageNum,
    });
  }),
);

app.get(
  "/success-stories/:slug",
  asyncHandler(async (req, res) => {
    const row = await prisma.janaSevaSuccessStory.findUnique({
      where: { slug: req.params.slug },
    });
    if (!row || row.status !== "OPEN") return error(res, "Story not found", 404);
    await prisma.janaSevaSuccessStory.update({
      where: { id: row.id },
      data: { viewCount: { increment: 1 } },
    });
    success(res, storyPublic(row));
  }),
);

app.post(
  "/success-stories",
  requireJanaSevaEmail,
  optionalAuth,
  asyncHandler(async (req, res) => {
    const b = req.body;
    if (!b.volunteerName || !b.caption || !b.helpedSummary || !b.consentGiven) {
      return error(res, "Volunteer name, caption, who was helped, and consent are required");
    }
    const photoUrls = Array.isArray(b.photoUrls)
      ? b.photoUrls.map(String).filter((u: string) => /^https?:\/\//i.test(u)).slice(0, 6)
      : typeof b.photoUrls === "string"
        ? b.photoUrls
            .split(/[\n,]+/)
            .map((u: string) => u.trim())
            .filter((u: string) => /^https?:\/\//i.test(u))
            .slice(0, 6)
        : [];
    if (photoUrls.length === 0) return error(res, "Add at least one photo URL (https://...)");

    const anonymize = !!b.anonymizeHelped;
    const helpedDisplay = anonymize ? "A community member (name private)" : String(b.helpedSummary);
    const sevaType = b.sevaType || "OTHER";
    const hashtags = normalizeHashtags(b.hashtags);

    const created = await prisma.janaSevaSuccessStory.create({
      data: {
        slug: makeSlug(`story-${b.volunteerName}`),
        volunteerName: String(b.volunteerName),
        contactEmail: req.janaSevaEmail!,
        sevaType,
        caption: String(b.caption),
        helpedSummary: String(b.helpedSummary),
        helpedDisplay,
        photoUrls,
        hashtags,
        city: b.city || null,
        state: b.state || null,
        consentGiven: true,
        userId: req.user?.id,
        ...VERIFIED_POST,
      },
    });

    success(res, storyPublic(created), 201);
  }),
);

// ─── Abuse reports ──────────────────────────────────────────
app.post(
  "/reports",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { reason, details, bloodRequestId, emergencyPostId } = req.body;
    if (!reason) return error(res, "Reason required");
    const report = await prisma.charityAbuseReport.create({
      data: {
        reason,
        details,
        bloodRequestId,
        emergencyPostId,
        reporterId: req.user?.id,
      },
    });
    success(res, report, 201);
  }),
);

// ─── Admin moderation ─────────────────────────────────────
app.get(
  "/admin/queue",
  authMiddleware,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [blood, emergency, camps] = await Promise.all([
      prisma.bloodRequest.findMany({
        where: { verificationStatus: "PENDING" },
        take: 30,
        orderBy: { createdAt: "desc" },
      }),
      prisma.emergencyPost.findMany({
        where: { verificationStatus: "PENDING" },
        take: 20,
        orderBy: { createdAt: "desc" },
      }),
      prisma.bloodCamp.findMany({
        where: { verificationStatus: "PENDING" },
        take: 20,
        orderBy: { createdAt: "desc" },
      }),
    ]);
    success(res, { blood, emergency, camps });
  }),
);

app.patch(
  "/admin/verify/:entity/:id",
  authMiddleware,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { entity, id } = req.params;
    const status = req.body.status || "VERIFIED";
    const data = {
      verificationStatus: status as "VERIFIED" | "REJECTED" | "SUSPENDED" | "PENDING",
      verifiedAt: status === "VERIFIED" ? new Date() : null,
    };
    let updated: unknown;
    switch (entity) {
      case "blood":
        updated = await prisma.bloodRequest.update({ where: { id }, data });
        break;
      case "camp":
        updated = await prisma.bloodCamp.update({ where: { id }, data });
        break;
      case "workshop":
        updated = await prisma.workshop.update({ where: { id }, data });
        break;
      case "scholarship":
        updated = await prisma.scholarship.update({ where: { id }, data });
        break;
      case "emergency":
        updated = await prisma.emergencyPost.update({ where: { id }, data });
        break;
      case "volunteer":
        updated = await prisma.charityProfile.update({ where: { id }, data });
        break;
      default:
        return error(res, "Invalid entity");
    }
    await prisma.charityAuditLog.create({
      data: {
        action: `verify_${status}`,
        entityType: entity,
        entityId: id,
        actorId: req.user!.id,
        metadata: JSON.stringify(req.body),
      },
    });
    success(res, updated);
  }),
);

const PORT = process.env.PORT || 4006;
logOtpEmailConfig();
app.listen(PORT, () => {
  console.log(`❤️ Charity Service running on :${PORT}`);
});
