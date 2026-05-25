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
import { DEFAULT_STORY_HASHTAGS, SEVA_STORY_TYPES } from "@/lib/jana-seva";
import { api } from "@/lib/api-client";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-white/80">
      {children}
    </label>
  );
}

export default function NewSuccessStoryPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      toast.error("Please confirm consent to publish photos and story publicly.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      const created = await api.createSuccessStory({
        volunteerName: fd.get("volunteerName"),
        sevaType: fd.get("sevaType"),
        caption: fd.get("caption"),
        helpedSummary: fd.get("helpedSummary"),
        photoUrls: fd.get("photoUrls"),
        hashtags: fd.get("hashtags"),
        city: fd.get("city"),
        state: fd.get("state"),
        anonymizeHelped: fd.get("anonymizeHelped") === "on",
        consentGiven: true,
      });
      toast.success("Story posted! Share it on social media.");
      router.push(`/jana-seva/stories/${created.slug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post story");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell background="form" overlay="dark">
      <div className="container-page py-8 sm:py-12 max-w-lg">
        <Link href="/jana-seva/stories" className="text-sm text-white/60 hover:text-white inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Seva Stories
        </Link>
        <FadeIn className="mt-4">
          <PageHeading
            title="Share Who You Helped"
            subtitle="Post to the Jana Seva community with photos, caption, and hashtags — then share on WhatsApp, X, or Facebook."
          />
        </FadeIn>

        <div className="mt-6">
          <EmailOtpGate>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <FieldLabel htmlFor="volunteerName">Your name (volunteer) *</FieldLabel>
                <Input id="volunteerName" name="volunteerName" required className="glass mt-1" />
              </div>
              <div>
                <FieldLabel htmlFor="sevaType">Type of seva *</FieldLabel>
                <Select id="sevaType" name="sevaType" required className="mt-1" defaultValue="BLOOD">
                  {SEVA_STORY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <FieldLabel htmlFor="helpedSummary">Who did you help? *</FieldLabel>
                <Input
                  id="helpedSummary"
                  name="helpedSummary"
                  required
                  className="glass mt-1"
                  placeholder="e.g. Patient at NIMS needing O+ blood"
                />
              </div>
              <label className="flex items-start gap-2 text-sm text-white/70">
                <input type="checkbox" name="anonymizeHelped" className="mt-1" />
                Hide the person&apos;s name publicly (show as &quot;community member&quot;)
              </label>
              <div>
                <FieldLabel htmlFor="caption">Caption for community & social *</FieldLabel>
                <textarea
                  id="caption"
                  name="caption"
                  required
                  rows={4}
                  className="mt-1 w-full rounded-md glass border border-white/25 bg-zinc-950 px-3 py-2 text-white text-sm"
                  placeholder="Tell the community what you did and how it helped..."
                />
              </div>
              <div>
                <FieldLabel htmlFor="photoUrls">Photo URLs * (one per line, https://)</FieldLabel>
                <textarea
                  id="photoUrls"
                  name="photoUrls"
                  required
                  rows={3}
                  className="mt-1 w-full rounded-md glass border border-white/25 bg-zinc-950 px-3 py-2 text-white text-sm"
                  placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                />
                <p className="text-xs text-white/45 mt-1">
                  Upload images to Imgur, Cloudinary, or Google Drive (public link), then paste URLs here.
                </p>
              </div>
              <div>
                <FieldLabel htmlFor="hashtags">Hashtags</FieldLabel>
                <Input
                  id="hashtags"
                  name="hashtags"
                  defaultValue={DEFAULT_STORY_HASHTAGS}
                  className="glass mt-1"
                  placeholder="#JanaSeva, #PowerStar"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input id="city" name="city" className="glass mt-1" />
                </div>
                <div>
                  <FieldLabel htmlFor="state">State</FieldLabel>
                  <Input id="state" name="state" defaultValue="Andhra Pradesh" className="glass mt-1" />
                </div>
              </div>
              <label className="flex items-start gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1"
                />
                I consent to publish this story, photos, and caption on PawanKalyanFan for the community.
              </label>
              <Button type="submit" disabled={submitting} className="w-full min-h-[48px]">
                {submitting ? "Posting…" : "Post & get share links"}
              </Button>
            </form>
          </EmailOtpGate>
        </div>
      </div>
    </PageShell>
  );
}
