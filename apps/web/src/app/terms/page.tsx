import { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { SITE } from "@/lib/constants";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Terms of Service",
  description: "Terms and conditions for using the PawanKalyanFan website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using {SITE.name}, you agree to these Terms of Service. If you do not agree,
          please do not use the website.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">2. Unofficial Fan Site</h2>
        <p>{SITE.disclaimer}</p>
        <p className="mt-2">
          All movie titles, images, dialogues, and related media referenced on this site belong to their
          respective copyright holders. Content is shared for non-commercial, informational, and
          entertainment purposes.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">3. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Use the site for unlawful, harmful, or abusive purposes</li>
          <li>Redistribute site content at scale without permission</li>
          <li>Attempt to disrupt, hack, or overload the website</li>
          <li>Impersonate Pawan Kalyan or official representatives</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">4. Brand Collaborations & Promotions</h2>
        <p>
          Business inquiries regarding collaborations, promotions, or advertising should be directed to{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="text-brand-red hover:underline">{SITE.contactEmail}</a>.
          Any commercial arrangement will be subject to separate agreement.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">5. Disclaimer of Warranties</h2>
        <p>
          The website is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee
          uninterrupted access, accuracy of fan-curated content, or fitness for a particular purpose.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, {SITE.name} and its operators shall not be liable for
          any indirect, incidental, or consequential damages arising from your use of the site.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">7. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the site after changes constitutes
          acceptance of the revised terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-2">8. Contact</h2>
        <p>
          Questions about these terms? Email{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="text-brand-red hover:underline">{SITE.contactEmail}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
