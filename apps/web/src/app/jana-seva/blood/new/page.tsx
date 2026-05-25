"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmailOtpGate } from "@/components/jana-seva/email-otp-gate";
import { api } from "@/lib/api-client";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-white/80">
      {children}
    </label>
  );
}

export default function NewBloodRequestPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      toast.error("Please confirm consent to share this request.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      const created = await api.createBloodRequest({
        patientName: fd.get("patientName"),
        hospitalName: fd.get("hospitalName"),
        hospitalAddress: fd.get("hospitalAddress"),
        city: fd.get("city"),
        state: fd.get("state"),
        bloodGroup: fd.get("bloodGroup"),
        unitsRequired: fd.get("unitsRequired"),
        urgency: fd.get("urgency"),
        phone: fd.get("phone"),
        whatsapp: fd.get("whatsapp"),
        anonymous: fd.get("anonymous") === "on",
        consentGiven: true,
      });
      toast.success("Blood request posted.");
      router.push(`/jana-seva/blood/${created.slug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell background="form" overlay="dark">
      <div className="container-page py-8 sm:py-12 max-w-lg">
        <Link href="/jana-seva/blood" className="text-sm text-white/60 hover:text-white inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Blood requests
        </Link>
        <FadeIn className="mt-4">
          <PageHeading title="Post Blood Request" subtitle="Verify email with OTP, then submit your request." />
        </FadeIn>

        <div className="mt-6">
          <EmailOtpGate>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <FieldLabel htmlFor="patientName">Patient name (or initials)</FieldLabel>
                <Input id="patientName" name="patientName" className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="hospitalName">Hospital *</FieldLabel>
                <Input id="hospitalName" name="hospitalName" required className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="hospitalAddress">Address</FieldLabel>
                <Input id="hospitalAddress" name="hospitalAddress" className="glass mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel htmlFor="city">City *</FieldLabel>
                  <Input id="city" name="city" required className="glass mt-1" />
                </div>
                <div>
                  <FieldLabel htmlFor="state">State *</FieldLabel>
                  <Input id="state" name="state" defaultValue="Andhra Pradesh" required className="glass mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel htmlFor="bloodGroup">Blood group *</FieldLabel>
                  <Input id="bloodGroup" name="bloodGroup" placeholder="O+" required className="glass mt-1" />
                </div>
                <div>
                  <FieldLabel htmlFor="unitsRequired">Units</FieldLabel>
                  <Input id="unitsRequired" name="unitsRequired" type="number" defaultValue={1} min={1} className="glass mt-1" />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="urgency">Urgency</FieldLabel>
                <select id="urgency" name="urgency" className="mt-1 w-full rounded-md glass border border-white/20 bg-black/40 px-3 py-2 text-white">
                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="phone">Phone *</FieldLabel>
                <Input id="phone" name="phone" required className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="whatsapp">WhatsApp</FieldLabel>
                <Input id="whatsapp" name="whatsapp" className="glass mt-1" />
              </div>
              <label className="flex items-start gap-2 text-sm text-white/70">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
                I consent to share this request for community help.
              </label>
              <label className="flex items-center gap-2 text-sm text-white/60">
                <input type="checkbox" name="anonymous" /> Post anonymously
              </label>
              <Button type="submit" disabled={submitting} className="w-full min-h-[48px]">
                {submitting ? "Submitting…" : "Post request"}
              </Button>
            </form>
          </EmailOtpGate>
        </div>
      </div>
    </PageShell>
  );
}
