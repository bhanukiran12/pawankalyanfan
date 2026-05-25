"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Cake, Calendar } from "lucide-react";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { PkBirthdaySocialShare } from "@/components/pk-birthday/pk-birthday-social-share";
import { api, type PkBirthdayCountdownPayload } from "@/lib/api-client";
import {
  formatBirthdayDate,
  getBirthdayCountdown,
  getOnThisDayMilestones,
} from "@/lib/pk-birthday";

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[4.5rem] sm:min-w-[6rem] rounded-xl bg-gradient-to-b from-white/10 to-black/60 border border-white/15 px-4 py-4 shadow-inner">
      <span className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide text-white tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand-gold/90 mt-2 font-medium">
        {label}
      </span>
    </div>
  );
}

export default function PkBirthdayPage() {
  const [now, setNow] = useState(() => new Date());
  const [apiData, setApiData] = useState<PkBirthdayCountdownPayload | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    api.getPkBirthdayCountdown().then(setApiData).catch(() => setApiData(null));
  }, []);

  const countdown = useMemo(() => getBirthdayCountdown(now), [now]);
  const onThisDay = useMemo(() => getOnThisDayMilestones(now), [now]);
  const birthdayLabel = formatBirthdayDate();

  return (
    <PageShell background="home" overlay="hero">
      <div className="container-page py-10 sm:py-14">
        <FadeIn>
          <Badge className="bg-brand-red text-white border-0 mb-4">Power Star Birthday</Badge>
          <PageHeading
            title={countdown.isToday ? "Happy Birthday, Power Star!" : "Birthday Countdown"}
            subtitle={`Pawan Kalyan · ${birthdayLabel} · Fan tribute`}
          />
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          {countdown.isToday ? (
            <div className="rounded-2xl glass-card border border-brand-red/50 p-10 text-center">
              <Cake className="h-16 w-16 text-brand-gold mx-auto mb-4" />
              <p className="font-display text-4xl sm:text-5xl text-white tracking-wide">Power Star Day</p>
              <p className="mt-4 text-white/75 max-w-lg mx-auto">
                Today we celebrate PSPK. Share your wishes with fans everywhere.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl glass-card border border-white/15 p-8 sm:p-12 bg-black/40 text-center">
              <p className="text-white/70 mb-8">
                Next birthday · <span className="text-brand-gold">{birthdayLabel}</span>
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <CountdownUnit value={countdown.days} label="Days" />
                <CountdownUnit value={countdown.hours} label="Hours" />
                <CountdownUnit value={countdown.minutes} label="Minutes" />
                <CountdownUnit value={countdown.seconds} label="Seconds" />
              </div>
            </div>
          )}
        </FadeIn>

        {apiData && (
          <FadeIn delay={0.2} className="mt-10">
            <h3 className="font-display text-xl sm:text-2xl text-white tracking-wide text-center mb-2">
              Share the countdown
            </h3>
            <p className="text-sm text-white/60 text-center mb-6 max-w-md mx-auto">
              Spread the spirit on social media — WhatsApp, X, Facebook, or copy the message.
            </p>
            <PkBirthdaySocialShare share={apiData.share} className="justify-center" />
          </FadeIn>
        )}

        {onThisDay.length > 0 && (
          <FadeIn delay={0.25} className="mt-12">
            <h3 className="font-display text-2xl text-white tracking-wide flex items-center gap-2 mb-4">
              <Calendar className="h-6 w-6 text-brand-red" />
              On this day, PK was…
            </h3>
            <ul className="space-y-3">
              {onThisDay.map((item) => (
                <li key={`${item.year}-${item.headline}`} className="glass-card rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-brand-gold">{item.year}</p>
                  <p className="font-display text-lg text-white mt-1">{item.headline}</p>
                  <p className="text-sm text-white/70 mt-1">{item.detail}</p>
                </li>
              ))}
            </ul>
            <Link href="/events" className="inline-block mt-4 text-sm text-brand-red hover:underline">
              Full timeline →
            </Link>
          </FadeIn>
        )}

        <p className="mt-10 text-center">
          <Link href="/" className="text-sm text-white/50 hover:text-white">
            ← Back to home
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
