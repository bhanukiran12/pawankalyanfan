import Link from "next/link";
import { SiteLogo } from "@/components/layout/site-logo";
import { SITE, FOOTER_NAV_LINKS } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-black via-brand-black-light to-black">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden />
      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <SiteLogo size={56} showText textClassName="text-xl" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              {SITE.tagline}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Partnerships & inquiries:{" "}
              <a href={`mailto:${SITE.contactEmail}`} className="text-brand-red hover:underline">
                {SITE.contactEmail}
              </a>
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Menu</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-red transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/ai" className="hover:text-brand-red transition-colors">
                  Ask
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-brand-red transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-red transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-brand-red transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-xs text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {SITE.disclaimer}
          </p>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
