"use client";

import { useEffect, useState } from "react";
import { Bell, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api, type VolunteerAlertPrefs } from "@/lib/api-client";
import { JANA_SEVA_EMAIL_KEY, JANA_SEVA_SESSION_KEY } from "@/lib/jana-seva";
import { pushSupported, subscribeJanaSevaVolunteerPush } from "@/lib/push-client";

export function VolunteerAlertsPanel({ compact = false }: { compact?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [pushLoading, setPushLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [pushAvailable, setPushAvailable] = useState(false);
  const [hasPush, setHasPush] = useState(false);
  const [prefs, setPrefs] = useState<VolunteerAlertPrefs | null>(null);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    setHasSession(!!sessionStorage.getItem(JANA_SEVA_SESSION_KEY));
    if (!sessionStorage.getItem(JANA_SEVA_SESSION_KEY)) {
      setLoading(false);
      return;
    }
    api
      .getVolunteerAlertPrefs()
      .then((d) => {
        setRegistered(d.registered);
        setPushAvailable(d.pushAvailable);
        setHasPush(d.hasPushSubscription);
        setPrefs(d.preferences);
      })
      .catch(() => setRegistered(false))
      .finally(() => setLoading(false));
  }, []);

  async function savePrefs(patch: Partial<VolunteerAlertPrefs>) {
    if (!hasSession) {
      toast.error("Verify your email on a Jana Seva form first.");
      return;
    }
    try {
      const updated = await api.updateVolunteerAlertPrefs(patch);
      setPrefs(updated);
      toast.success("Alert preferences saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    }
  }

  async function enableBrowserAlerts() {
    if (!registered) {
      toast.error("Register as a volunteer first.");
      return;
    }
    setPushLoading(true);
    try {
      const result = await subscribeJanaSevaVolunteerPush();
      if (result.ok) {
        setHasPush(true);
        toast.success("Browser alerts enabled for Jana Seva help posts.");
      } else if (result.reason === "denied") {
        toast.error("Notifications blocked. Allow them in browser settings.");
      } else if (result.reason === "no-vapid") {
        toast.error("Push not configured on server. Set VAPID keys in .env.");
      } else {
        toast.error("Could not enable browser alerts.");
      }
    } finally {
      setPushLoading(false);
    }
  }

  if (loading) return null;

  if (!hasSession) {
    return (
      <p className={`text-sm text-white/55 ${compact ? "" : "mb-6"}`}>
        Verify your email on any Jana Seva post form to manage volunteer alerts.
      </p>
    );
  }

  if (!registered) {
    return (
      <div className={`glass rounded-xl border border-white/10 p-4 ${compact ? "" : "mb-6"}`}>
        <p className="text-sm text-white/70">
          <Bell className="inline h-4 w-4 mr-2 text-brand-red" />
          Register as a volunteer to get email and browser alerts when someone needs help.
        </p>
      </div>
    );
  }

  return (
    <div className={`glass rounded-xl border border-white/10 p-5 ${compact ? "" : "mb-8"}`}>
      <h3 className="font-display text-lg text-white flex items-center gap-2">
        <Bell className="h-5 w-5 text-brand-red" />
        Help alerts
      </h3>
      <p className="text-sm text-white/60 mt-2">
        Get notified in your browser and by email when new help requests are posted in your city (
        {prefs?.city || "your profile city"}).
      </p>

      <div className="mt-4 space-y-2 text-sm text-white/75">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs?.emailAlertsEnabled ?? true}
            onChange={(e) => savePrefs({ emailAlertsEnabled: e.target.checked })}
          />
          <Mail className="h-4 w-4" />
          Email alerts
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs?.notifyBlood ?? true}
            onChange={(e) => savePrefs({ notifyBlood: e.target.checked })}
          />
          Blood requests
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs?.notifyEmergency ?? true}
            onChange={(e) => savePrefs({ notifyEmergency: e.target.checked })}
          />
          Emergency help
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs?.notifyEducation ?? true}
            onChange={(e) => savePrefs({ notifyEducation: e.target.checked })}
          />
          Education help
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs?.notifyCamps ?? true}
            onChange={(e) => savePrefs({ notifyCamps: e.target.checked })}
          />
          Blood camps nearby
        </label>
      </div>

      {pushSupported() && pushAvailable && (
        <div className="mt-4">
          {hasPush ? (
            <p className="text-sm text-emerald-400/90">Browser notifications are on.</p>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="glass border-brand-red/40"
              disabled={pushLoading}
              onClick={enableBrowserAlerts}
            >
              {pushLoading ? "Enabling…" : "Enable browser notifications"}
            </Button>
          )}
        </div>
      )}

      {pushSupported() && !pushAvailable && (
        <p className="text-xs text-white/45 mt-3">Browser push needs VAPID keys on the server.</p>
      )}

      <p className="text-xs text-white/40 mt-3">
        Verified email: {sessionStorage.getItem(JANA_SEVA_EMAIL_KEY) || "—"}
      </p>
    </div>
  );
}
