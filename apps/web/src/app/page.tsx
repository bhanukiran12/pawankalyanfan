"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Film, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerItem, HeroText } from "@/components/motion/fade-in";
import { HeaderAd, InContentAd } from "@/components/ads/ad-block";
import { BrandCollaborations } from "@/components/home/brand-collaborations";
import { PkBirthdayHub } from "@/components/home/pk-birthday-hub";
import { JanaSevaHub } from "@/components/home/jana-seva-hub";
import { QuoteSlider } from "@/components/home/quote-slider";
import { ContentRail } from "@/components/home/content-rail";
import { SiteLogo } from "@/components/layout/site-logo";
import { SectionBackground } from "@/components/layout/section-background";
import { PageLoader } from "@/components/ui/skeleton";
import { api, HomeData } from "@/lib/api-client";
import { SECTION_BACKGROUNDS, SITE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    api.getHome().then(setData).catch(() =>
      setData({ movies: [], quotes: [], news: [], wallpapers: [], events: [] })
    );
  }, []);

  if (!data) {
    return (
      <SectionBackground image={SECTION_BACKGROUNDS.home} overlay="hero" className="min-h-screen flex items-center justify-center">
        <PageLoader />
      </SectionBackground>
    );
  }

  return (
    <>
      <SectionBackground
        image={SECTION_BACKGROUNDS.home}
        overlay="hero"
        className="min-h-[85dvh] sm:min-h-[90vh] flex items-center"
      >
        <div className="container-page relative py-12 sm:py-16 md:py-20 w-full">
          <FadeIn className="mb-4 sm:mb-6 flex flex-wrap items-center gap-3 sm:gap-4">
            <SiteLogo size={56} className="shrink-0 sm:hidden" />
            <SiteLogo size={72} className="shrink-0 hidden sm:block" />
            <Badge variant="outline" className="border-brand-red/40 text-white/90 text-xs sm:text-sm">
              Fan Tribute · Not Official
            </Badge>
          </FadeIn>

          <HeroText className="font-display text-[2.75rem] leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-wider drop-shadow-lg">
            <span className="text-brand-red">PAWAN</span>
            <br />
            <span className="text-white">KALYAN</span>
            <br />
            <span className="text-gradient text-4xl sm:text-5xl md:text-6xl lg:text-7xl">FAN</span>
          </HeroText>

          <div className="mt-6 sm:mt-8 max-w-3xl">
            <FadeIn delay={0.3}>
              <p className="text-base sm:text-lg text-white/90 drop-shadow-md leading-relaxed">
                {SITE.tagline}
              </p>
            </FadeIn>
            <FadeIn delay={0.5}>
              <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link href="/movies" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto min-h-[48px]">
                    <Film className="mr-2 h-4 w-4" /> His Cinema
                  </Button>
                </Link>
                <Link href="/quotes" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="glass w-full sm:w-auto min-h-[48px]">
                    <Quote className="mr-2 h-4 w-4" /> His Words
                  </Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="glass w-full sm:w-auto min-h-[48px]">
                    Partnerships <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>

          {data.quotes.length > 0 && (
            <FadeIn delay={0.7} className="mt-8 sm:mt-10 max-w-2xl">
              <QuoteSlider quotes={data.quotes.slice(0, 5)} />
            </FadeIn>
          )}
        </div>
      </SectionBackground>

      <PkBirthdayHub />

      <JanaSevaHub />

      <HeaderAd />

      <SectionBackground image={SECTION_BACKGROUNDS.movies} overlay="gradient" className="py-12 sm:py-16">
        <div className="container-page">
          <FadeIn>
            <div className="mb-6 sm:mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="section-title">On Screen</h2>
                <p className="text-white/80 text-sm sm:text-base mt-1">Every mass moment on screen</p>
              </div>
              <Link href="/movies" className="text-brand-red hover:underline text-sm min-h-[44px] inline-flex items-center sm:min-h-0">
                See all →
              </Link>
            </div>
          </FadeIn>
          <ContentRail items={data.movies.map((m) => ({
            id: m.id, title: m.title, href: `/movies/${m.slug}`,
            image: m.posterUrl, subtitle: formatDate(m.releaseDate),
          }))} />
        </div>
      </SectionBackground>

      <InContentAd />

      <SectionBackground image={SECTION_BACKGROUNDS.quotes} overlay="gradient" className="py-12 sm:py-16">
        <div className="container-page">
          <FadeIn>
            <div className="mb-6 sm:mb-8 flex items-start gap-3">
              <Quote className="h-7 w-7 sm:h-8 sm:w-8 text-brand-red shrink-0 mt-1" />
              <div>
                <h2 className="section-title">Words I Live By</h2>
                <p className="text-white/70 text-sm mt-1">Dialogues that echo in every fan&apos;s heart</p>
              </div>
            </div>
          </FadeIn>
          <StaggerContainer className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {data.quotes.slice(0, 8).map((quote) => (
              <StaggerItem key={quote.id}>
                <Card className="h-full glass-card hover:border-brand-red/30 transition-all">
                  <CardContent className="flex h-full flex-col justify-between p-6">
                    <p className="text-sm italic leading-relaxed">&ldquo;{quote.text}&rdquo;</p>
                    <div className="mt-4">
                      <Badge>{quote.category.replace("_", " ")}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </SectionBackground>

      <SectionBackground image={SECTION_BACKGROUNDS.form} overlay="dark" className="py-12 sm:py-16 pb-24 md:pb-20">
        <div className="container-page">
          <BrandCollaborations />
        </div>
      </SectionBackground>
    </>
  );
}
