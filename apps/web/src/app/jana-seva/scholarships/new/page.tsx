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
import { api } from "@/lib/api-client";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-white/80">
      {children}
    </label>
  );
}

export default function NewScholarshipPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await api.createScholarship({
        title: fd.get("title"),
        provider: fd.get("provider"),
        amount: fd.get("amount"),
        eligibility: fd.get("eligibility"),
        deadline: fd.get("deadline"),
        applicationUrl: fd.get("applicationUrl"),
        category: fd.get("category"),
        documentsRequired: fd.get("documentsRequired"),
        description: fd.get("description"),
      });
      toast.success("Opportunity listed.");
      router.push("/jana-seva/scholarships");
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
          <PageHeading
            title="Share Scholarship or Program"
            subtitle="List a scholarship, coaching grant, or mentorship opportunity for students."
          />
        </FadeIn>

        <div className="mt-6">
          <EmailOtpGate>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <FieldLabel htmlFor="title">Title *</FieldLabel>
                <Input id="title" name="title" required className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="provider">Provider / trust *</FieldLabel>
                <Input id="provider" name="provider" required className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="amount">Amount or benefit</FieldLabel>
                <Input id="amount" name="amount" className="glass mt-1" placeholder="e.g. ₹50,000 / year" />
              </div>
              <div>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Select id="category" name="category" defaultValue="scholarships" className="mt-1">
                  <option value="scholarships">Scholarship</option>
                  <option value="coaching">Coaching</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="books">Books / materials</option>
                </Select>
              </div>
              <div>
                <FieldLabel htmlFor="eligibility">Eligibility *</FieldLabel>
                <textarea
                  id="eligibility"
                  name="eligibility"
                  required
                  rows={2}
                  className="mt-1 w-full rounded-md glass border border-white/20 bg-black/40 px-3 py-2 text-white"
                />
              </div>
              <div>
                <FieldLabel htmlFor="deadline">Application deadline *</FieldLabel>
                <Input id="deadline" name="deadline" type="date" required className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="applicationUrl">Apply link *</FieldLabel>
                <Input id="applicationUrl" name="applicationUrl" type="url" required className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="documentsRequired">Documents required</FieldLabel>
                <Input id="documentsRequired" name="documentsRequired" className="glass mt-1" placeholder="Aadhaar, marksheet, etc." />
              </div>
              <div>
                <FieldLabel htmlFor="description">More details</FieldLabel>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="mt-1 w-full rounded-md glass border border-white/20 bg-black/40 px-3 py-2 text-white"
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full min-h-[48px]">
                {submitting ? "Posting…" : "List opportunity"}
              </Button>
            </form>
          </EmailOtpGate>
        </div>
      </div>
    </PageShell>
  );
}
