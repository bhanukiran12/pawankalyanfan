"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
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

export default function JanaSevaVolunteerRegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await api.registerJanaSevaVolunteer({
        displayName: fd.get("displayName"),
        city: fd.get("city"),
        state: fd.get("state"),
        phone: fd.get("phone"),
        skills: fd.get("skills"),
        availability: fd.get("availability"),
        isBloodDonor: fd.get("isBloodDonor") === "on",
        isWorkshopMentor: fd.get("isWorkshopMentor") === "on",
        isEventVolunteer: fd.get("isEventVolunteer") === "on",
        offersTransport: fd.get("offersTransport") === "on",
        isEmergencyResponder: fd.get("isEmergencyResponder") === "on",
      });
      toast.success("Welcome to Jana Seva Volunteers!");
      router.push("/jana-seva/volunteers");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell background="form" overlay="gradient">
      <div className="container-page py-8 sm:py-12 max-w-lg">
        <Link href="/jana-seva/volunteers" className="text-sm text-white/60 hover:text-white inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Volunteers
        </Link>
        <FadeIn className="mt-4 flex items-center gap-3">
          <Users className="h-10 w-10 text-brand-red" />
          <PageHeading
            title="Jana Seva Volunteers"
            subtitle="Register to offer help — blood donation, events, transport, emergencies."
          />
        </FadeIn>

        <div className="mt-6">
          <EmailOtpGate>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <FieldLabel htmlFor="displayName">Display name *</FieldLabel>
                <Input id="displayName" name="displayName" required className="glass mt-1" />
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
              <div>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input id="phone" name="phone" className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="skills">Skills (comma separated)</FieldLabel>
                <Input id="skills" name="skills" className="glass mt-1" placeholder="blood donor, first aid" />
              </div>
              <div>
                <FieldLabel htmlFor="availability">Availability</FieldLabel>
                <Input id="availability" name="availability" className="glass mt-1" placeholder="Weekends, evenings" />
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isBloodDonor" /> Blood donor
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isWorkshopMentor" /> Workshop mentor
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isEventVolunteer" /> Event volunteer
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="offersTransport" /> Transport support
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isEmergencyResponder" /> Emergency responder
                </label>
              </div>
              <Button type="submit" disabled={submitting} className="w-full min-h-[48px]">
                {submitting ? "Registering…" : "Register as Jana Seva Volunteer"}
              </Button>
            </form>
          </EmailOtpGate>
        </div>
      </div>
    </PageShell>
  );
}
