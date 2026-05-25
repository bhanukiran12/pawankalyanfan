"use client";

import Link from "next/link";
import {
  ExternalLink,
  GraduationCap,
  HandHeart,
  MapPin,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { PageShell } from "@/components/layout/section-background";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SENANI_STUDENTS_WING, SITE } from "@/lib/constants";

const PROGRAMS = [
  {
    icon: MapPin,
    title: "District programs",
    text: "Activities and outreach organized at the district level for student participation.",
  },
  {
    icon: Sparkles,
    title: "Youth encouragement",
    text: "Motivating youth and building leadership skills among students.",
  },
  {
    icon: GraduationCap,
    title: "Student welfare",
    text: "Programs focused on student well-being, support, and growth.",
  },
  {
    icon: HandHeart,
    title: "Support & cooperation",
    text: "Helping those in need through coordinated student-wing efforts.",
  },
  {
    icon: Target,
    title: "Responsible leadership",
    text: "Leadership for social development — students, society, and change.",
  },
] as const;

export default function JanasenaStudentsPage() {
  const formUrl = SENANI_STUDENTS_WING.registrationUrl;

  return (
    <PageShell background="form" overlay="darker">
      <div className="container-page py-6 sm:py-10">
        <FadeIn>
          <PageHeading
            title="Senani Students Wing"
            subtitle="Our goal, our responsibility — a journey for students, for society, for change. Register through the official student-wing survey."
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>Jana Sena · Students</Badge>
            <Badge variant="outline">External registration</Badge>
          </div>
        </FadeIn>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-start">
          <FadeIn delay={0.05}>
            <div className="rounded-xl overflow-hidden glass-card border border-white/10 cinematic-shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SENANI_STUDENTS_WING.flyerImage}
                alt="Senani Students Wing — registration flyer"
                className="w-full h-auto"
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground text-center sm:text-left">
              Flyer courtesy of {SENANI_STUDENTS_WING.name}. {SITE.disclaimer}
            </p>
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={0.1}>
              <section className="rounded-xl glass-card border border-brand-red/30 p-5 sm:p-6">
                <h2 className="font-display text-2xl tracking-wide text-brand-red-light">
                  Register now
                </h2>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">
                  Tap below to open the official registration survey. You will complete the form on
                  the Senani Students Wing website — it opens in a new tab.
                </p>
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-5 w-full sm:w-auto"
                >
                  <Button size="lg" className="w-full sm:min-w-[280px] min-h-[52px] text-base">
                    Open registration form
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <p className="mt-3 text-xs text-white/50 break-all">{formUrl}</p>
              </section>
            </FadeIn>

            <FadeIn delay={0.15}>
              <section className="rounded-xl glass-card border border-white/10 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-brand-red" />
                  <h2 className="font-display text-xl tracking-wide">Our main programs</h2>
                </div>
                <ul className="space-y-4">
                  {PROGRAMS.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <div>
                        <p className="font-medium text-sm">{title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-sm text-white/70 italic text-center sm:text-left">
                &ldquo;Come… let&apos;s walk together — bringing change starts with us.&rdquo;
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/janasena-news">
                  <Button variant="outline" size="sm" className="min-h-[44px]">
                    Jana Sena News
                  </Button>
                </Link>
                <a
                  href={SENANI_STUDENTS_WING.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="sm" className="min-h-[44px]">
                    Wing website <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
