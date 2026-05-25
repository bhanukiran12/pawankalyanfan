"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/skeleton";
import { api, type CharityVolunteer } from "@/lib/api-client";

const tierLabels: Record<string, string> = {
  BRONZE: "Bronze Helper",
  SILVER: "Silver Helper",
  GOLD: "Gold Helper",
  HERO: "Hero Volunteer",
  LEGEND: "Legend Volunteer",
};

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<CharityVolunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getVolunteers()
      .then((d) => setVolunteers(d.volunteers))
      .catch(() => setVolunteers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell background="form" overlay="gradient">
      <div className="container-page py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <PageHeading title="Jana Seva Volunteers" subtitle="Community helpers — blood donors, mentors, emergency responders." />
          <Link href="/jana-seva/volunteers/register">
            <Button className="w-full sm:w-auto">Register as Volunteer</Button>
          </Link>
        </div>
        <Link href="/jana-seva" className="text-sm text-brand-red mt-2 inline-block">
          ← Jana Seva
        </Link>
        {loading ? (
          <PageLoader />
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {volunteers.map((v) => (
              <Card key={v.id} className="glass border-white/10">
                <CardContent className="p-5">
                  <Users className="h-8 w-8 text-brand-red mb-2" />
                  <h3 className="font-display text-lg text-white">{v.displayName}</h3>
                  <p className="text-sm text-white/55">
                    {v.city}, {v.state}
                  </p>
                  <Badge className="mt-3 bg-black/60 text-brand-gold border border-brand-gold/30">
                    {tierLabels[v.tier] || v.tier}
                  </Badge>
                  <p className="text-xs text-white/45 mt-2">Score {v.contributionScore}</p>
                  {v.skills.length > 0 && (
                    <p className="text-xs text-white/50 mt-2">{v.skills.join(" · ")}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
