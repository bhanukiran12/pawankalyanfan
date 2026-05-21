"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  pushSupported,
  registerPushServiceWorker,
  subscribeToPushNotifications,
  syncPushSubscriptionIfGranted,
} from "@/lib/push-client";

const DISMISS_KEY = "push_prompt_dismissed";
const SESSION_KEY = "push_prompt_shown_session";

export function NotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (!pushSupported()) return;
    setSupported(true);
    registerPushServiceWorker();

    if (Notification.permission === "granted") {
      syncPushSubscriptionIfGranted();
      return;
    }
    if (Notification.permission === "denied") return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, "1");
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!supported || !visible) return null;

  async function handleAllow() {
    setLoading(true);
    try {
      const result = await subscribeToPushNotifications();
      if (result.ok) {
        toast.success("Notifications enabled — you'll get alerts for new Jana Sena news.");
        setVisible(false);
        return;
      }
      if (result.reason === "denied") {
        toast.message("Notifications blocked. You can enable them later in browser settings.");
        setVisible(false);
        return;
      }
      if (result.reason === "no-vapid") {
        toast.error(
          "Push alerts are not configured yet. Add VAPID keys in Render → Environment, then redeploy.",
          { duration: 6000 },
        );
        return;
      }
      toast.error("Could not enable notifications. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close"
        onClick={dismiss}
      />
      <div
        role="dialog"
        aria-labelledby="notification-prompt-title"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl glass-card border border-brand-red/40 p-6 sm:p-8 shadow-2xl cinematic-shadow"
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 p-2 rounded-md text-muted-foreground hover:text-white hover:bg-white/10"
          aria-label="Not now"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red/20 mb-4">
            <Bell className="h-7 w-7 text-brand-red" />
          </div>
          <h2 id="notification-prompt-title" className="font-display text-2xl tracking-wide">
            Stay in the loop
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">
            Allow notifications in your browser to get instant alerts when new Jana Sena news and
            updates are published.
          </p>
          <p className="mt-2 text-xs text-white/50">
            Tap below — your browser will ask you to allow or block notifications.
          </p>

          <div className="mt-6 flex flex-col w-full gap-2 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="w-full sm:w-auto min-h-[48px] px-8"
              disabled={loading}
              onClick={handleAllow}
            >
              {loading ? "Opening browser prompt…" : "Allow notifications"}
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto min-h-[48px]"
              disabled={loading}
              onClick={dismiss}
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
