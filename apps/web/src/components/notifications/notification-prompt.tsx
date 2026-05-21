"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pushSupported, subscribeToPushNotifications } from "@/lib/push-client";

const DISMISS_KEY = "push_prompt_dismissed";

export function NotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pushSupported()) return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (Notification.permission === "granted") return;
    if (Notification.permission === "denied") return;

    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  async function handleEnable() {
    setLoading(true);
    try {
      const ok = await subscribeToPushNotifications();
      if (ok) setVisible(false);
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
      role="dialog"
      aria-label="Enable notifications"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[60] rounded-xl glass-card border border-brand-red/30 p-4 shadow-xl"
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-white"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex gap-3 pr-6">
        <Bell className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Jana Sena news alerts</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Allow browser notifications to get updates when new posts are published on the
            newsletter.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="min-h-[40px]" disabled={loading} onClick={handleEnable}>
              {loading ? "Enabling…" : "Allow notifications"}
            </Button>
            <Button size="sm" variant="ghost" className="min-h-[40px]" onClick={dismiss}>
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
