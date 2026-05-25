"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Droplet, Users, GraduationCap, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { api, type CharityStats } from "@/lib/api-client";

function Stat({ value, label, icon: Icon }: { value: number; label: string; icon: typeof Droplet }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-center">
      <Icon className="h-5 w-5 text-brand-red mx-auto mb-2" />
      <p className="font-display text-2xl sm:text-3xl text-white tabular-nums">{value.toLocaleString()}</p>
      <p className="text-xs text-white/60 mt-1">{label}</p>
    </div>
  );
}

export function JanaSevaHub() {
  const [stats, setStats] = useState<CharityStats | null>(null);

  useEffect(() => {
    api.getCharityStats().then(setStats).catch(() => setStats(null));
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
    <section className="relative py-12 sm:py-16 border-t border-white/10 bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="container-page">
        <FadeIn>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-brand-red text-white border-0">
              <Heart className="h-3 w-3 mr-1 inline" />
              Jana Seva
            </Badge>
            <span className="text-sm text-white/50">Verified community help — not a donation scam</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-wide">
            Help Someone <span className="text-brand-red">Today</span>
          </h2>
          <p className="mt-3 max-w-2xl text-white/70 text-sm sm:text-base">
            Blood requests, donation camps, free workshops, scholarships, volunteers, and moderated emergency
            support — coordinated with trust and transparency.
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Stat value={s.activeBloodRequests} label="active blood requests" icon={Droplet} />
          <Stat value={s.workshops} label="workshops" icon={GraduationCap} />
          <Stat value={s.volunteers} label="volunteers" icon={Users} />
          <Stat value={s.peopleHelped} label="people helped" icon={Heart} />
          <Stat value={s.activeEmergencies} label="verified emergencies" icon={AlertTriangle} />
        </FadeIn>

        <FadeIn delay={0.25} className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
          <Link href="/jana-seva">
            <Button size="lg" className="w-full sm:w-auto min-h-[48px]">
              Help Someone Today <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/jana-seva/need-help">
            <Button variant="outline" size="lg" className="glass w-full sm:w-auto min-h-[48px] border-brand-red/40">
              Request Help
            </Button>
          </Link>
          <Link href="/jana-seva/offer-help">
            <Button variant="outline" size="lg" className="glass w-full sm:w-auto min-h-[48px]">
              Offer Help
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
