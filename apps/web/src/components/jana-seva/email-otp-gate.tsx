"use client";

import { useEffect, useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { JANA_SEVA_EMAIL_KEY, JANA_SEVA_SESSION_KEY } from "@/lib/jana-seva";

export function EmailOtpGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem(JANA_SEVA_SESSION_KEY);
    const savedEmail = sessionStorage.getItem(JANA_SEVA_EMAIL_KEY);
    if (token && savedEmail) {
      setVerifiedEmail(savedEmail);
      setReady(true);
    }
  }, []);

  async function sendOtp() {
    if (!email.trim()) {
      toast.error("Enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await api.sendJanaSevaOtp(email.trim());
      setStep("code");
      if (res.devCode) {
        toast.message(`Email not sent — use this OTP: ${res.devCode}`, { duration: 20000 });
      } else {
        toast.success(res.message || "OTP sent. Check your email and spam folder.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    try {
      const res = await api.verifyJanaSevaOtp(email.trim(), code.trim());
      sessionStorage.setItem(JANA_SEVA_SESSION_KEY, res.sessionToken);
      sessionStorage.setItem(JANA_SEVA_EMAIL_KEY, res.email);
      setVerifiedEmail(res.email);
      setReady(true);
      toast.success("Email verified. You can post now.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    sessionStorage.removeItem(JANA_SEVA_SESSION_KEY);
    sessionStorage.removeItem(JANA_SEVA_EMAIL_KEY);
    setReady(false);
    setVerifiedEmail(null);
    setStep("email");
    setCode("");
  }

  if (ready) {
    return (
      <div>
        <p className="text-sm text-emerald-400/90 mb-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          Verified: {verifiedEmail}
          <button type="button" onClick={signOut} className="text-white/50 hover:text-white underline ml-2">
            Change email
          </button>
        </p>
        {children}
      </div>
    );
  }

  return (
    <div className="glass rounded-xl border border-white/10 p-6 max-w-md">
      <div className="flex items-center gap-2 text-white mb-2">
        <Mail className="h-5 w-5 text-brand-red" />
        <h3 className="font-semibold">Verify email to post</h3>
      </div>
      <p className="text-sm text-white/60 mb-4">
        OTP verification is required before posting any Jana Seva help request or volunteer registration.
      </p>
      {step === "email" ? (
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass"
          />
          <Button onClick={sendOtp} disabled={loading} className="w-full">
            {loading ? "Sending…" : "Send OTP"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Input
            placeholder="6-digit OTP"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="glass"
            maxLength={6}
          />
          <Button onClick={verifyOtp} disabled={loading} className="w-full">
            {loading ? "Verifying…" : "Verify & continue"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setStep("email")} className="text-white/50">
            Use different email
          </Button>
        </div>
      )}
    </div>
  );
}
