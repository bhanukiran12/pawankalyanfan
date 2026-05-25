"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { NEED_HELP_CATEGORIES } from "@/lib/jana-seva";

export default function NeedHelpPage() {
  return (
    <PageShell background="form" overlay="hero">
      <div className="container-page py-8 sm:py-12">
        <Link href="/jana-seva" className="text-sm text-white/60 hover:text-white inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Jana Seva
        </Link>
        <FadeIn className="mt-4">
          <PageHeading
            title="Need Help"
            subtitle="Choose what kind of help you need. Email OTP verification is required before posting."
          />
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEED_HELP_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <FadeIn key={cat.id}>
                <Link href={cat.href}>
                  <Card className="glass h-full hover:border-brand-red/50 transition-colors">
                    <CardContent className="p-5">
                      <Icon className="h-8 w-8 text-brand-red mb-3" />
                      <h3 className="font-display text-lg text-white tracking-wide">{cat.label}</h3>
                      <p className="text-sm text-white/60 mt-2">{cat.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
