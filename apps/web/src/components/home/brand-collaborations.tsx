import Link from "next/link";
import { Briefcase, Megaphone, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE, mailtoLink } from "@/lib/constants";

const INQUIRY_TYPES = [
  {
    icon: Briefcase,
    title: "Brand Collaborations",
    description: "Co-branded campaigns and fan-first activations — reach out to discuss.",
    subject: "Brand Collaboration Inquiry — PawanKalyanFan",
  },
  {
    icon: Megaphone,
    title: "Promotions & Advertising",
    description: "Reach passionate supporters with your brand or release.",
    subject: "Promotion / Advertising Inquiry — PawanKalyanFan",
  },
  {
    icon: MessageSquare,
    title: "General Queries",
    description: "Questions about the site, content corrections, media requests, or anything else.",
    subject: "General Query — PawanKalyanFan",
  },
] as const;

export function BrandCollaborations({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "text-center"}>
      {!compact && (
        <>
          <Mail className="mx-auto h-10 w-10 text-brand-red mb-4" />
          <h2 className="section-title drop-shadow-lg">Partnerships & Inquiries</h2>
          <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-white/80 text-sm sm:text-base px-2">
            Brands and partners who want to connect — get in touch.
          </p>
        </>
      )}

      <div className={`grid gap-4 grid-cols-1 ${compact ? "sm:grid-cols-2 lg:grid-cols-3" : "mt-8 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3"}`}>
        {INQUIRY_TYPES.map(({ icon: Icon, title, description, subject }) => (
          <Card key={title} className="glass-card text-left hover:border-brand-red/30 transition-all">
            <CardContent className="p-6 flex flex-col h-full">
              <Icon className="h-8 w-8 text-brand-red mb-3" />
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground flex-1">{description}</p>
              <a href={mailtoLink(subject)} className="mt-4 inline-block">
                <Button variant="outline" size="sm" className="w-full min-h-[44px]">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {!compact && (
        <div className="mt-8">
          <p className="text-sm text-white/70">
            Or write directly to{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="text-brand-red hover:underline font-medium">
              {SITE.contactEmail}
            </a>
          </p>
          <Link href="/contact" className="mt-4 inline-block">
            <Button variant="default" size="lg">View Contact Page</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
