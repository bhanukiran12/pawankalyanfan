"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Cake, Calendar, Clapperboard, Landmark, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { PkBirthdaySocialShare } from "@/components/pk-birthday/pk-birthday-social-share";
import { api, type PkBirthdayCountdownPayload } from "@/lib/api-client";
import {
  categoryLabel,
  formatBirthdayDate,
  getBirthdayCountdown,
  getOnThisDayMilestones,
  type PkMilestone,
  type PkMilestoneCategory,
} from "@/lib/pk-birthday";

function categoryIcon(cat: PkMilestoneCategory) {
  if (cat === "cinema") return Clapperboard;
  if (cat === "politics") return Landmark;
  if (cat === "birth") return Cake;
  return Sparkles;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="relative flex flex-col items-center min-w-[4rem] sm:min-w-[5.5rem] rounded-xl bg-gradient-to-b from-white/10 to-black/60 border border-white/15 px-3 py-3 sm:py-4 shadow-inner">
      <span className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide text-white tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand-gold/90 mt-2 font-medium">
        {label}
      </span>
    </div>
  );
}

function MilestoneCard({ item }: { item: PkMilestone }) {
  const Icon = categoryIcon(item.category);
  return (
    <article className="group rounded-xl glass-card border border-white/10 p-4 sm:p-5 h-full transition-colors hover:border-brand-red/40">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/30 to-brand-red/5 text-brand-red ring-1 ring-brand-red/30">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-brand-gold">
            {item.year} · {categoryLabel[item.category]}
          </p>
          <h3 className="font-display text-lg sm:text-xl tracking-wide mt-1 leading-tight group-hover:text-brand-red-light transition-colors">
            {item.headline}
          </h3>
          <p className="text-sm text-white/75 mt-2 leading-relaxed">{item.detail}</p>
        </div>
      </div>
    </article>
  );
}

function todayLabel(date: Date): string {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

export function PkBirthdayHub() {
  const [now, setNow] = useState(() => new Date());
  const [shareData, setShareData] = useState<PkBirthdayCountdownPayload | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    api.getPkBirthdayCountdown().then(setShareData).catch(() => setShareData(null));
  }, []);

  const countdown = useMemo(() => getBirthdayCountdown(now), [now]);
  const onThisDay = useMemo(() => getOnThisDayMilestones(now), [now]);
  const birthdayLabel = formatBirthdayDate();
  const hasOnThisDay = onThisDay.length > 0;

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden border-y border-white/10">
      <div
        className="absolute inset-0 bg-gradient-to-b from-brand-red/10 via-black/80 to-black pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(100%,36rem)] h-48 bg-brand-red/20 blur-[80px] pointer-events-none"
        aria-hidden
      />

      <div className="container-page relative">
        <FadeIn>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-brand-red/90 text-white border-0 shadow-lg shadow-brand-red/20">
              Power Star Birthday
            </Badge>
            {countdown.isBirthdaySeason && !countdown.isToday && (
              <Badge variant="outline" className="border-brand-gold/40 text-brand-gold">
                Birthday season
              </Badge>
            )}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide leading-[1.05]">
            {countdown.isToday ? (
              <>
                <span className="text-brand-red">Happy Birthday</span>
                <span className="text-white">, Pawan Kalyan!</span>
              </>
            ) : (
              <>
                <span className="text-white/90">Countdown to </span>
                <span className="text-brand-red">2 September</span>
              </>
            )}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/65 max-w-xl">
            {birthdayLabel} · Fan tribute · Not official
          </p>
        </FadeIn>

        <FadeIn delay={0.08} className="mt-8 sm:mt-10">
          {countdown.isToday ? (
            <div className="relative rounded-2xl glass-card border border-brand-red/50 p-8 sm:p-10 text-center cinematic-shadow overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-br from-brand-red/15 via-transparent to-brand-gold/5 pointer-events-none"
                aria-hidden
              />
              <Cake className="relative h-14 w-14 sm:h-16 sm:w-16 text-brand-gold mx-auto mb-5" aria-hidden />
              <p className="relative font-display text-3xl sm:text-4xl md:text-5xl tracking-wide text-white">
                Power Star Day
              </p>
              <p className="relative mt-4 text-base sm:text-lg text-white/80 max-w-md mx-auto leading-relaxed">
                Today we celebrate the man who shaped mass cinema, Jana Sena spirit, and generations of
                fans. Send your wishes.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl glass-card border border-white/15 p-6 sm:p-10 bg-black/40">
              <p className="text-center text-sm sm:text-base text-white/70 mb-6">
                Next celebration · <span className="text-brand-gold font-medium">{birthdayLabel}</span>
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <CountdownUnit value={countdown.days} label="Days" />
                <CountdownUnit value={countdown.hours} label="Hours" />
                <CountdownUnit value={countdown.minutes} label="Mins" />
                <CountdownUnit value={countdown.seconds} label="Secs" />
              </div>
            </div>
          )}
        </FadeIn>

        {shareData && (
          <FadeIn delay={0.12} className="mt-8">
            <p className="text-center text-sm text-white/65 mb-4">Share the countdown with fans</p>
            <PkBirthdaySocialShare share={shareData.share} className="justify-center" />
            <p className="text-center mt-4">
              <Link href="/pk-birthday" className="text-sm text-brand-red hover:underline">
                Full birthday page →
              </Link>
            </p>
          </FadeIn>
        )}

        {hasOnThisDay && (
          <FadeIn delay={0.15} className="mt-10 sm:mt-12">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5 pb-4 border-b border-white/10">
              <div>
                <p className="text-xs uppercase tracking-wider text-brand-red mb-1">{todayLabel(now)}</p>
                <h3 className="font-display text-2xl sm:text-3xl tracking-wide flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-brand-red shrink-0" aria-hidden />
                  On this day, PK was…
                </h3>
              </div>
              <Link
                href="/events"
                className="text-xs text-brand-red hover:underline shrink-0 min-h-[44px] inline-flex items-center sm:min-h-0"
              >
                Full timeline →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {onThisDay.map((item) => (
                <MilestoneCard key={`${item.year}-${item.headline}`} item={item} />
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
