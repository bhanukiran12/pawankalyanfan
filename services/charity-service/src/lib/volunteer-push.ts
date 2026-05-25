type WebPushModule = typeof import("web-push");

let webpush: WebPushModule | null = null;
let loadAttempted = false;

function getWebPush(): WebPushModule | null {
  if (loadAttempted) return webpush;
  loadAttempted = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    webpush = require("web-push") as WebPushModule;
  } catch {
    webpush = null;
  }
  return webpush;
}

function vapidConfigured(): boolean {
  return Boolean(
    process.env.VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_SUBJECT,
  );
}

function configureWebPush(): void {
  const wp = getWebPush();
  if (!wp || !vapidConfigured()) return;
  wp.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
}

export async function sendVolunteerPushNotifications(
  subs: { endpoint: string; p256dh: string; auth: string }[],
  payload: { title: string; body: string; url: string; tag: string },
): Promise<number> {
  const wp = getWebPush();
  if (!wp || !vapidConfigured() || !subs.length) return 0;
  configureWebPush();

  const data = JSON.stringify(payload);
  let sent = 0;

  for (const sub of subs) {
    try {
      await wp.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        data,
      );
      sent++;
    } catch (err: unknown) {
      const status = (err as { statusCode?: number })?.statusCode;
      if (status === 404 || status === 410) {
        await import("@pkf/database").then(({ prisma }) =>
          prisma.janaSevaVolunteerAlert.updateMany({
            where: { pushEndpoint: sub.endpoint },
            data: { pushEndpoint: null, pushP256dh: null, pushAuth: null },
          }),
        );
      }
    }
  }
  return sent;
}

export function isVolunteerPushAvailable(): boolean {
  return getWebPush() !== null && vapidConfigured();
}
