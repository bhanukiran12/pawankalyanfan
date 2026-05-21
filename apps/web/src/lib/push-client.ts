import { api } from "@/lib/api-client";

const SW_PATH = "/sw.js";

function encodeSubscriptionKey(key: ArrayBuffer | null): string {
  if (!key) return "";
  const bytes = new Uint8Array(key);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

/** VAPID public key for PushManager — must use ArrayBuffer-backed view (TS strict). */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const arr = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

/** Register service worker early so subscribe is ready when the user allows notifications. */
export function registerPushServiceWorker(): void {
  if (!pushSupported()) return;
  navigator.serviceWorker.register(SW_PATH).catch(() => undefined);
}

/** Triggers the native browser permission dialog (requires user gesture). */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!pushSupported()) return "denied";
  return Notification.requestPermission();
}

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "unsupported" | "denied" | "no-vapid" | "subscribe-failed" };

async function completePushSubscribe(): Promise<SubscribeResult> {
  const publicKey =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    (await api.getPushPublicKey().catch(() => null))?.publicKey;

  if (!publicKey) return { ok: false, reason: "no-vapid" };

  try {
    const registration = await navigator.serviceWorker.register(SW_PATH);
    await navigator.serviceWorker.ready;

    const existing = await registration.pushManager.getSubscription();
    const sub =
      existing ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      }));

    const p256dh = sub.getKey("p256dh");
    const auth = sub.getKey("auth");
    if (!p256dh || !auth) return { ok: false, reason: "subscribe-failed" };

    await api.subscribePush({
      endpoint: sub.endpoint,
      keys: {
        p256dh: encodeSubscriptionKey(p256dh),
        auth: encodeSubscriptionKey(auth),
      },
    });

    localStorage.setItem("push_subscribed", "1");
    return { ok: true };
  } catch {
    return { ok: false, reason: "subscribe-failed" };
  }
}

/** Sync server when permission was already granted (no new browser prompt). */
export async function syncPushSubscriptionIfGranted(): Promise<void> {
  if (!pushSupported() || Notification.permission !== "granted") return;
  await completePushSubscribe();
}

export async function subscribeToPushNotifications(): Promise<SubscribeResult> {
  if (!pushSupported()) return { ok: false, reason: "unsupported" };

  const permission = await requestNotificationPermission();
  if (permission !== "granted") return { ok: false, reason: "denied" };

  return completePushSubscribe();
}
