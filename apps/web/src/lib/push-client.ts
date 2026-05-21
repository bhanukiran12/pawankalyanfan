import { api } from "@/lib/api-client";

function encodeSubscriptionKey(key: ArrayBuffer | null): string {
  if (!key) return "";
  const bytes = new Uint8Array(key);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
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

export async function subscribeToPushNotifications(): Promise<boolean> {
  if (!pushSupported()) return false;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  const publicKey =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    (await api.getPushPublicKey().catch(() => null))?.publicKey;

  if (!publicKey) return false;

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    await api.subscribePush({
      endpoint: existing.endpoint,
      keys: {
        p256dh: encodeSubscriptionKey(existing.getKey("p256dh")),
        auth: encodeSubscriptionKey(existing.getKey("auth")),
      },
    });
    return true;
  }

  const sub = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  const p256dh = sub.getKey("p256dh");
  const auth = sub.getKey("auth");
  if (!p256dh || !auth) return false;

  await api.subscribePush({
    endpoint: sub.endpoint,
    keys: {
      p256dh: encodeSubscriptionKey(p256dh),
      auth: encodeSubscriptionKey(auth),
    },
  });

  localStorage.setItem("push_subscribed", "1");
  return true;
}
