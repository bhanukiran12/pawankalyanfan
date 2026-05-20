import { Metadata } from "next";
import { BrandCollaborations } from "@/components/home/brand-collaborations";
import { SiteLogo } from "@/components/layout/site-logo";
import { PageShell } from "@/components/layout/section-background";
import { SITE } from "@/lib/constants";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Contact",
  description: "Contact Pawan Kalyan fan website for brand collaborations, promotions, and inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageShell background="form" overlay="dark">
      <div className="container-page py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <SiteLogo size={56} className="mx-auto mb-4 sm:hidden" />
          <SiteLogo size={64} className="mx-auto mb-4 hidden sm:block" />
          <h1 className="page-title">Get In Touch</h1>
          <p className="page-subtitle mx-auto">
            Brands, partners, and well-wishers — reach out to the fan behind this tribute.
          </p>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="mt-6 inline-block text-xl font-medium text-brand-red hover:underline"
          >
            {SITE.contactEmail}
          </a>
        </div>

        <BrandCollaborations compact />

        <div className="mt-12 max-w-xl mx-auto glass-card rounded-xl p-6 text-center text-sm text-muted-foreground">
          <p>
            I typically respond within 2–3 business days. Include your name and a short note about how I can help.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
