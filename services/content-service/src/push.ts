import { getSetting, setSetting } from "./site-settings";
import type { JanasenaArticle } from "./janasena-news";

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
    console.warn("[push] web-push not installed — browser notifications disabled. Run: npm install");
    webpush = null;
  }
  return webpush;
}

const SUBS_KEY = "push_subscriptions";
const NOTIFIED_KEY = "janasena_notified_ids";

export type PushSubscriptionPayload = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

function vapidConfigured(): boolean {
  return Boolean(
    process.env.VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_SUBJECT,
  );
}

export function configureWebPush(): void {
  const wp = getWebPush();
  if (!wp || !vapidConfigured()) return;
  wp.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
}

export async function savePushSubscription(sub: PushSubscriptionPayload): Promise<void> {
  const subs = await getSetting<PushSubscriptionPayload[]>(SUBS_KEY, []);
  const exists = subs.some((s) => s.endpoint === sub.endpoint);
  if (!exists) {
    subs.push(sub);
    await setSetting(SUBS_KEY, subs);
  }
}

export async function removePushSubscription(endpoint: string): Promise<void> {
  const subs = await getSetting<PushSubscriptionPayload[]>(SUBS_KEY, []);
  await setSetting(
    SUBS_KEY,
    subs.filter((s) => s.endpoint !== endpoint),
  );
}

export async function notifyNewJanasenaArticles(articles: JanasenaArticle[]): Promise<number> {
  const wp = getWebPush();
  if (!wp || !vapidConfigured() || !articles.length) return 0;

  const notifiedList = await getSetting<string[]>(NOTIFIED_KEY, []);
  if (!notifiedList.length) {
    await setSetting(NOTIFIED_KEY, articles.map((a) => a.id).slice(0, 100));
    return 0;
  }

  const notified = new Set(notifiedList);
  const fresh = articles.filter((a) => !notified.has(a.id));
  if (!fresh.length) return 0;

  const subs = await getSetting<PushSubscriptionPayload[]>(SUBS_KEY, []);
  if (!subs.length) {
    await markNotified(fresh.map((a) => a.id), notified);
    return 0;
  }

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://pawankalyanfan.com").replace(/\/$/, "");
  let sent = 0;

  for (const article of fresh.slice(0, 5)) {
    const payload = JSON.stringify({
      title: article.breaking ? `Breaking: ${article.title}` : article.title,
      body: article.excerpt.slice(0, 120),
      url: `${site}${article.siteUrl}`,
      tag: article.id,
    });

    for (const sub of subs) {
      try {
        await wp.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload);
        sent++;
      } catch (err: unknown) {
        const status = (err as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) {
          await removePushSubscription(sub.endpoint);
        }
      }
    }
  }

  await markNotified(fresh.map((a) => a.id), notified);
  return sent;
}

async function markNotified(ids: string[], existing: Set<string>): Promise<void> {
  for (const id of ids) existing.add(id);
  const trimmed = [...existing].slice(-500);
  await setSetting(NOTIFIED_KEY, trimmed);
}

export function getVapidPublicKey(): string | null {
  return process.env.VAPID_PUBLIC_KEY || null;
}

export function isPushAvailable(): boolean {
  return getWebPush() !== null && vapidConfigured();
}
