"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Plus } from "lucide-react";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <PageHeading title="Blood Donation Camps" subtitle="Community-listed drives — volunteers can add new camps." />
          <Link href="/jana-seva/camps/new">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Blood Camp
            </Button>
          </Link>
        </div>
        <Link href="/jana-seva" className="text-sm text-brand-red mt-2 inline-block">
          ← Jana Seva
        </Link>
        {loading ? (
          <PageLoader />
        ) : camps.length === 0 ? (
          <p className="mt-8 text-white/60">
            No camps listed yet.{" "}
            <Link href="/jana-seva/camps/new" className="text-brand-red hover:underline">
              Add the first blood camp
            </Link>
          </p>
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
                  {c.phone && (
                    <p className="text-sm text-white/70 mt-2">
                      Contact:{" "}
                      <a href={`tel:${c.phone}`} className="text-brand-red hover:underline">
                        {c.phone}
                      </a>
                    </p>
                  )}
                  <Badge className="mt-3 bg-emerald-600/90 text-white border-0">Community listed</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
