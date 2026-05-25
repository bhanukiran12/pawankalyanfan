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

export default function NewEducationHelpPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = `[Education] ${fd.get("title")}`;
    setSubmitting(true);
    try {
      await api.createEmergencyPost({
        title,
        category: "URGENT_ASSISTANCE",
        description: fd.get("description"),
        city: fd.get("city"),
        state: fd.get("state"),
        phone: fd.get("phone"),
      });
      toast.success("Education help request posted.");
      router.push("/jana-seva/emergency");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell background="form" overlay="dark">
      <div className="container-page py-8 sm:py-12 max-w-lg">
        <Link href="/jana-seva/need-help" className="text-sm text-white/60 hover:text-white inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Need Help
        </Link>
        <FadeIn className="mt-4">
          <PageHeading
            title="Education Help"
            subtitle="Scholarships, books, coaching, mentorship — describe what you need."
          />
        </FadeIn>

        <div className="mt-6">
          <EmailOtpGate>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <FieldLabel htmlFor="title">Short title *</FieldLabel>
                <Input id="title" name="title" required className="glass mt-1" placeholder="e.g. Class 12 scholarship" />
              </div>
              <div>
                <FieldLabel htmlFor="description">Details *</FieldLabel>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  className="mt-1 w-full rounded-md glass border border-white/20 bg-black/40 px-3 py-2 text-white"
                />
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
                <FieldLabel htmlFor="phone">Contact phone *</FieldLabel>
                <Input id="phone" name="phone" required className="glass mt-1" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full min-h-[48px]">
                {submitting ? "Posting…" : "Post request"}
              </Button>
            </form>
          </EmailOtpGate>
        </div>
      </div>
    </PageShell>
  );
}
