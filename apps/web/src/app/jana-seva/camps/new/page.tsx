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

export default function NewBloodCampPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await api.createBloodCamp({
        title: fd.get("title"),
        organizerName: fd.get("organizerName"),
        organization: fd.get("organization"),
        address: fd.get("address"),
        city: fd.get("city"),
        state: fd.get("state"),
        campDate: fd.get("campDate"),
        campTime: fd.get("campTime"),
        phone: fd.get("phone"),
        registrationUrl: fd.get("registrationUrl"),
        description: fd.get("description"),
      });
      toast.success("Blood camp listed.");
      router.push("/jana-seva/camps");
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
          <PageHeading title="Add Blood Donation Camp" subtitle="Announce a drive for the community." />
        </FadeIn>

        <div className="mt-6">
          <EmailOtpGate>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <FieldLabel htmlFor="title">Camp title *</FieldLabel>
                <Input id="title" name="title" required className="glass mt-1" placeholder="e.g. Power Star Blood Drive" />
              </div>
              <div>
                <FieldLabel htmlFor="organizerName">Organizer name *</FieldLabel>
                <Input id="organizerName" name="organizerName" required className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="organization">Organization / group</FieldLabel>
                <Input id="organization" name="organization" className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="address">Venue address *</FieldLabel>
                <Input id="address" name="address" required className="glass mt-1" />
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
                  <FieldLabel htmlFor="campDate">Date *</FieldLabel>
                  <Input id="campDate" name="campDate" type="date" required className="glass mt-1" />
                </div>
                <div>
                  <FieldLabel htmlFor="campTime">Time</FieldLabel>
                  <Input id="campTime" name="campTime" type="time" defaultValue="09:00" className="glass mt-1" />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="phone">Contact phone *</FieldLabel>
                <Input id="phone" name="phone" required className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="registrationUrl">Registration link (optional)</FieldLabel>
                <Input id="registrationUrl" name="registrationUrl" type="url" className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="description">Details</FieldLabel>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="mt-1 w-full rounded-md glass border border-white/20 bg-black/40 px-3 py-2 text-white"
                  placeholder="Who can donate, documents needed, etc."
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full min-h-[48px]">
                {submitting ? "Posting…" : "List blood camp"}
              </Button>
            </form>
          </EmailOtpGate>
        </div>
      </div>
    </PageShell>
  );
}
