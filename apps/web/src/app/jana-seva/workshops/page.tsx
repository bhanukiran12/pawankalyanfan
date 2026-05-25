"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/ui/skeleton";
import { api, type Workshop } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getWorkshops()
      .then((d) => setWorkshops(d.workshops))
      .catch(() => setWorkshops([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell background="form" overlay="gradient">
      <div className="container-page py-8 sm:py-12">
        <PageHeading title="Free Workshops" subtitle="Coding, UPSC, career, health & more — community learning." />
        <Link href="/jana-seva" className="text-sm text-brand-red mt-2 inline-block">
          ← Jana Seva
        </Link>
        {loading ? (
          <PageLoader />
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workshops.map((w) => (
              <Card key={w.id} className="glass border-white/10 h-full">
                <CardContent className="p-5">
                  {w.trending && <Badge className="mb-2 bg-brand-red text-white border-0">Trending</Badge>}
                  <h3 className="font-display text-lg text-white">{w.title}</h3>
                  <p className="text-sm text-white/60 mt-1">{w.speaker}</p>
                  <p className="text-xs text-white/45 mt-2 capitalize">{w.category} · {w.mode}</p>
                  <p className="text-sm text-white/55 mt-2">{formatDate(w.workshopDate)}</p>
                  {w.isFree && <Badge variant="outline" className="mt-3 border-white/20 text-white/70">Free</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
