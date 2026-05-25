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
import { Select } from "@/components/ui/select";
import { EmailOtpGate } from "@/components/jana-seva/email-otp-gate";
import { WORKSHOP_CATEGORIES } from "@/lib/jana-seva";
import { api } from "@/lib/api-client";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-white/80">
      {children}
    </label>
  );
}

export default function NewWorkshopPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await api.createWorkshop({
        title: fd.get("title"),
        speaker: fd.get("speaker"),
        organization: fd.get("organization"),
        category: fd.get("category"),
        mode: fd.get("mode"),
        city: fd.get("city"),
        workshopDate: fd.get("workshopDate"),
        workshopTime: fd.get("workshopTime"),
        capacity: fd.get("capacity") ? Number(fd.get("capacity")) : undefined,
        registrationUrl: fd.get("registrationUrl"),
        whatsappGroupUrl: fd.get("whatsappGroupUrl"),
        isFree: fd.get("isFree") === "on",
        certificateAvailable: fd.get("certificateAvailable") === "on",
        description: fd.get("description"),
      });
      toast.success("Workshop listed.");
      router.push("/jana-seva/workshops");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell background="form" overlay="dark">
      <div className="container-page py-8 sm:py-12 max-w-lg">
        <Link href="/jana-seva/offer-help" className="text-sm text-white/60 hover:text-white inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Offer Help
        </Link>
        <FadeIn className="mt-4">
          <PageHeading title="Host a Free Workshop" subtitle="Share skills with the community — online or in person." />
        </FadeIn>

        <div className="mt-6">
          <EmailOtpGate>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <FieldLabel htmlFor="title">Workshop title *</FieldLabel>
                <Input id="title" name="title" required className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="speaker">Speaker / mentor *</FieldLabel>
                <Input id="speaker" name="speaker" required className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="organization">Organization</FieldLabel>
                <Input id="organization" name="organization" className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="category">Category *</FieldLabel>
                <Select id="category" name="category" required className="mt-1 capitalize">
                  {WORKSHOP_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <FieldLabel htmlFor="mode">Mode *</FieldLabel>
                <Select id="mode" name="mode" defaultValue="ONLINE" className="mt-1">
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                  <option value="HYBRID">Hybrid</option>
                </Select>
              </div>
              <div>
                <FieldLabel htmlFor="city">City (for offline/hybrid)</FieldLabel>
                <Input id="city" name="city" className="glass mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel htmlFor="workshopDate">Date *</FieldLabel>
                  <Input id="workshopDate" name="workshopDate" type="date" required className="glass mt-1" />
                </div>
                <div>
                  <FieldLabel htmlFor="workshopTime">Time</FieldLabel>
                  <Input id="workshopTime" name="workshopTime" type="time" defaultValue="10:00" className="glass mt-1" />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="capacity">Max participants</FieldLabel>
                <Input id="capacity" name="capacity" type="number" min={1} className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="registrationUrl">Registration link</FieldLabel>
                <Input id="registrationUrl" name="registrationUrl" type="url" className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="whatsappGroupUrl">WhatsApp group link</FieldLabel>
                <Input id="whatsappGroupUrl" name="whatsappGroupUrl" type="url" className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="mt-1 w-full rounded-md glass border border-white/20 bg-black/40 px-3 py-2 text-white"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" name="isFree" defaultChecked /> This workshop is free
              </label>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" name="certificateAvailable" /> Certificate available
              </label>
              <Button type="submit" disabled={submitting} className="w-full min-h-[48px]">
                {submitting ? "Posting…" : "List workshop"}
              </Button>
            </form>
          </EmailOtpGate>
        </div>
      </div>
    </PageShell>
  );
}
