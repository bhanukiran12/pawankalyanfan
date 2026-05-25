"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/ui/skeleton";
import { api, type BloodCamp } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default function BloodCampsPage() {
  const [camps, setCamps] = useState<BloodCamp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBloodCamps()
      .then((d) => setCamps(d.camps))
      .catch(() => setCamps([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell background="form" overlay="gradient">
      <div className="container-page py-8 sm:py-12">
        <PageHeading title="Blood Donation Camps" subtitle="Verified drives — contact masked until reveal." />
        <Link href="/jana-seva" className="text-sm text-brand-red mt-2 inline-block">
          ← Jana Seva
        </Link>
        {loading ? (
          <PageLoader />
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {camps.map((c) => (
              <Card key={c.id} className="glass border-white/10">
                <CardContent className="p-5">
                  <h3 className="font-display text-xl text-white">{c.title}</h3>
                  <p className="text-sm text-white/65 mt-1">{c.organizerName}</p>
                  <p className="flex items-center gap-2 text-sm text-white/55 mt-3">
                    <Calendar className="h-4 w-4" />
                    {formatDate(c.campDate)} · {c.campTime}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-white/55 mt-1">
                    <MapPin className="h-4 w-4" />
                    {c.city}, {c.state}
                  </p>
                  <Badge className="mt-3 bg-emerald-600/90 text-white border-0">Verified</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
