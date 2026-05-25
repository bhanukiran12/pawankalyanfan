import { prisma } from "@pkf/database";
import { sendTransactionalEmail } from "./send-transactional-email";
import { sendVolunteerPushNotifications } from "./volunteer-push";

export type HelpAlertKind = "BLOOD" | "EMERGENCY" | "CAMP" | "EDUCATION";

export type HelpAlertPayload = {
  kind: HelpAlertKind;
  title: string;
  summary: string;
  urlPath: string;
  city: string;
  state?: string;
  tagId: string;
};

function siteBase(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://pawankalyanfan.com";
  return raw.startsWith("http") ? raw.replace(/\/$/, "") : `https://${raw.replace(/\/$/, "")}`;
}

function cityMatches(volunteerCity: string | null | undefined, postCity: string): boolean {
  if (!volunteerCity?.trim()) return true;
  const v = volunteerCity.trim().toLowerCase();
  const p = postCity.trim().toLowerCase();
  return p.includes(v) || v.includes(p);
}

function kindEnabled(
  row: {
    notifyBlood: boolean;
    notifyEmergency: boolean;
    notifyCamps: boolean;
    notifyEducation: boolean;
  },
  kind: HelpAlertKind,
): boolean {
  switch (kind) {
    case "BLOOD":
      return row.notifyBlood;
    case "EMERGENCY":
      return row.notifyEmergency;
    case "CAMP":
      return row.notifyCamps;
    case "EDUCATION":
      return row.notifyEducation;
    default:
      return true;
  }
}

export async function upsertVolunteerAlertPrefs(
  email: string,
  charityProfileId: string,
  prefs: {
    city?: string;
    state?: string;
    emailAlertsEnabled?: boolean;
    pushAlertsEnabled?: boolean;
    notifyBlood?: boolean;
    notifyEmergency?: boolean;
    notifyCamps?: boolean;
    notifyEducation?: boolean;
  },
) {
  return prisma.janaSevaVolunteerAlert.upsert({
    where: { email },
    create: {
      email,
      charityProfileId,
      city: prefs.city,
      state: prefs.state,
      emailAlertsEnabled: prefs.emailAlertsEnabled !== false,
      pushAlertsEnabled: prefs.pushAlertsEnabled !== false,
      notifyBlood: prefs.notifyBlood !== false,
      notifyEmergency: prefs.notifyEmergency !== false,
      notifyCamps: prefs.notifyCamps !== false,
      notifyEducation: prefs.notifyEducation !== false,
    },
    update: {
      charityProfileId,
      city: prefs.city,
      state: prefs.state,
      ...(prefs.emailAlertsEnabled !== undefined && { emailAlertsEnabled: !!prefs.emailAlertsEnabled }),
      ...(prefs.pushAlertsEnabled !== undefined && { pushAlertsEnabled: !!prefs.pushAlertsEnabled }),
      ...(prefs.notifyBlood !== undefined && { notifyBlood: !!prefs.notifyBlood }),
      ...(prefs.notifyEmergency !== undefined && { notifyEmergency: !!prefs.notifyEmergency }),
      ...(prefs.notifyCamps !== undefined && { notifyCamps: !!prefs.notifyCamps }),
      ...(prefs.notifyEducation !== undefined && { notifyEducation: !!prefs.notifyEducation }),
    },
  });
}

export async function saveVolunteerPushSubscription(
  email: string,
  sub: { endpoint: string; keys: { p256dh: string; auth: string } },
) {
  const profile = await prisma.charityProfile.findFirst({ where: { contactEmail: email } });
  if (!profile) {
    throw new Error("Register as a Jana Seva volunteer before enabling browser alerts.");
  }

  await upsertVolunteerAlertPrefs(email, profile.id, {
    city: profile.city,
    state: profile.state,
    pushAlertsEnabled: true,
  });

  const existing = await prisma.janaSevaVolunteerAlert.findUnique({ where: { email } });
  if (existing?.pushEndpoint && existing.pushEndpoint !== sub.endpoint) {
    await prisma.janaSevaVolunteerAlert.updateMany({
      where: { pushEndpoint: existing.pushEndpoint },
      data: { pushEndpoint: null, pushP256dh: null, pushAuth: null },
    });
  }

  return prisma.janaSevaVolunteerAlert.update({
    where: { email },
    data: {
      pushEndpoint: sub.endpoint,
      pushP256dh: sub.keys.p256dh,
      pushAuth: sub.keys.auth,
      pushAlertsEnabled: true,
    },
  });
}

export async function notifyVolunteersOfHelp(payload: HelpAlertPayload): Promise<void> {
  const rows = await prisma.janaSevaVolunteerAlert.findMany();
  const url = `${siteBase()}${payload.urlPath.startsWith("/") ? payload.urlPath : `/${payload.urlPath}`}`;
  const siteName = process.env.SITE_NAME || "PawanKalyanFan Jana Seva";

  const emailTargets: string[] = [];
  const pushTargets: { endpoint: string; p256dh: string; auth: string }[] = [];

  for (const row of rows) {
    if (!kindEnabled(row, payload.kind)) continue;
    if (!cityMatches(row.city, payload.city)) continue;

    if (row.emailAlertsEnabled) emailTargets.push(row.email);
    if (
      row.pushAlertsEnabled &&
      row.pushEndpoint &&
      row.pushP256dh &&
      row.pushAuth
    ) {
      pushTargets.push({
        endpoint: row.pushEndpoint,
        p256dh: row.pushP256dh,
        auth: row.pushAuth,
      });
    }
  }

  const subject = `[Jana Seva] ${payload.title}`;
  const text = `${payload.summary}\n\nView & help: ${url}\n\n— ${siteName}`;
  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
      <h2 style="color:#c41e3a;">${siteName}</h2>
      <p><strong>${payload.title}</strong></p>
      <p>${payload.summary}</p>
      <p style="color:#666;font-size:14px;">${payload.city}${payload.state ? `, ${payload.state}` : ""}</p>
      <p><a href="${url}" style="color:#c41e3a;font-weight:bold;">Open listing &amp; help →</a></p>
      <p style="color:#999;font-size:12px;">You receive this because you registered as a Jana Seva volunteer.</p>
    </div>
  `;

  await Promise.all(
    [...new Set(emailTargets)].map(async (to) => {
      const r = await sendTransactionalEmail(to, subject, html, text);
      if (!r.ok) console.error(`[Jana Seva alert email] ${to}:`, r.error);
    }),
  );

  await sendVolunteerPushNotifications(pushTargets, {
    title: payload.title,
    body: payload.summary.slice(0, 160),
    url,
    tag: `jana-seva-${payload.kind}-${payload.tagId}`,
  });
}

export function scheduleVolunteerHelpAlert(payload: HelpAlertPayload): void {
  void notifyVolunteersOfHelp(payload).catch((e) =>
    console.error("[Jana Seva volunteer alerts]", e),
  );
}
