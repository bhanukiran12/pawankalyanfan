"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Droplet,
  Calendar,
  GraduationCap,
  Users,
  AlertTriangle,
  Shield,
  Heart,
  ArrowRight,
  Camera,
} from "lucide-react";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/ui/skeleton";
import { api, type CharityStats } from "@/lib/api-client";

const modules = [
  { href: "/jana-seva/blood", label: "Blood Requests", icon: Droplet, desc: "Urgent & verified donation needs" },
  { href: "/jana-seva/camps", label: "Blood Camps", icon: Calendar, desc: "Upcoming donation drives" },
  { href: "/jana-seva/workshops", label: "Free Workshops", icon: GraduationCap, desc: "Skills & career sessions" },
  { href: "/jana-seva/scholarships", label: "Education Help", icon: GraduationCap, desc: "Scholarships & mentorship" },
  { href: "/jana-seva/volunteers", label: "Volunteer Network", icon: Users, desc: "Offer your time & skills" },
  { href: "/jana-seva/stories", label: "Seva Stories", icon: Camera, desc: "Volunteers share who they helped" },
  { href: "/jana-seva/emergency", label: "Emergency Board", icon: AlertTriangle, desc: "Strictly moderated listings" },
];

export default function JanaSevaPage() {
  const [stats, setStats] = useState<CharityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCharityStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const s = stats ?? {
    activeBloodRequests: 0,
    bloodCamps: 0,
    workshops: 0,
    volunteers: 0,
    peopleHelped: 0,
    activeEmergencies: 0,
  };

  return (
    <PageShell background="form" overlay="hero">
      <div className="container-page py-8 sm:py-12">
        <FadeIn>
          <Badge className="bg-brand-red text-white border-0 mb-4">
            <Shield className="h-3 w-3 mr-1 inline" />
            Trust · Transparency · Community
          </Badge>
          <PageHeading
            title="Jana Seva"
            subtitle="A verified community-help platform — coordinate blood, education, volunteers, and emergencies. This is not a donation scam site."
          />
        </FadeIn>

        {loading ? (
          <PageLoader />
        ) : (
          <FadeIn delay={0.1} className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { n: s.activeBloodRequests, l: "blood requests" },
              { n: s.workshops, l: "workshops" },
              { n: s.volunteers, l: "volunteers" },
              { n: s.peopleHelped, l: "people helped" },
              { n: s.bloodCamps, l: "blood camps" },
            ].map((item) => (
              <div
                key={item.l}
                className="rounded-xl border border-white/10 bg-black/60 p-4 text-center"
              >
                <p className="font-display text-2xl text-white">{item.n.toLocaleString()}</p>
                <p className="text-xs text-white/60 mt-1">{item.l}</p>
              </div>
            ))}
          </FadeIn>
        )}

        <FadeIn delay={0.2} className="mt-8 flex flex-wrap gap-3">
          <Link href="/jana-seva/need-help">
            <Button size="lg" className="min-h-[48px]">
              <Heart className="mr-2 h-4 w-4" /> Request Help
            </Button>
          </Link>
          <Link href="/jana-seva/offer-help">
            <Button variant="outline" size="lg" className="glass min-h-[48px] border-brand-red/40">
              Offer Help <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </FadeIn>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <FadeIn key={m.href}>
                <Link href={m.href}>
                  <Card className="glass h-full hover:border-brand-red/40 transition-colors">
                    <CardContent className="p-5">
                      <Icon className="h-8 w-8 text-brand-red mb-3" />
                      <h3 className="font-display text-xl text-white tracking-wide">{m.label}</h3>
                      <p className="text-sm text-white/65 mt-2">{m.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <p className="mt-10 text-xs text-white/45 max-w-2xl">
          Posting requires email OTP verification. Contact numbers are shown on listings. Report abuse on any post.
        </p>
      </div>
    </PageShell>
  );
}
