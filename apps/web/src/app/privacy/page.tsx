import { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { SITE } from "@/lib/constants";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Privacy Policy",
  description: "How PawanKalyanFan collects, uses, and protects your information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">1. Introduction</h2>
        <p>
          {SITE.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates an unofficial fan website dedicated to Pawan Kalyan.
          This Privacy Policy explains how we handle information when you visit or use our website.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">2. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Usage data:</strong> We may collect anonymous analytics such as pages visited, browser type, and device information to improve the site.</li>
          <li><strong>Cookies:</strong> We may use essential cookies for basic site functionality and preferences.</li>
          <li><strong>Contact emails:</strong> If you email us at {SITE.contactEmail}, we receive the information you include in your message.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">3. How We Use Information</h2>
        <p>We use collected information to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Provide and maintain website features</li>
          <li>Respond to inquiries sent to {SITE.contactEmail}</li>
          <li>Improve content, performance, and security</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">4. Sharing of Information</h2>
        <p>
          We do not sell your personal data. We may share limited information with trusted service providers
          (such as hosting or analytics providers) solely to operate the website. We may disclose
          information if required by law.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">5. Third-Party Links</h2>
        <p>
          Our site may link to external websites (e.g. movie trailers, news sources). We are not responsible
          for the privacy practices of those third-party sites.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">6. Disclaimer</h2>
        <p>{SITE.disclaimer}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">7. Contact</h2>
        <p>
          For privacy-related questions, email{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="text-brand-red hover:underline">{SITE.contactEmail}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
