"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLoader } from "@/components/ui/skeleton";
import { BloodRequestCard } from "@/components/charity/blood-request-card";
import { api, type BloodRequest } from "@/lib/api-client";

function BloodRequestsContent() {
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [bloodGroup, setBloodGroup] = useState("");

  function load(cityFilter = city, groupFilter = bloodGroup) {
    setLoading(true);
    const params: Record<string, string> = {};
    if (cityFilter) params.city = cityFilter;
    if (groupFilter) params.bloodGroup = groupFilter;
    api
      .getBloodRequests(params)
      .then((d) => setRequests(d.requests))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const qCity = searchParams.get("city");
    if (qCity) setCity(qCity);
    load(qCity || city, bloodGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <PageShell background="form" overlay="gradient">
      <div className="container-page py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <PageHeading title="Blood Donation Requests" subtitle="Sorted by urgency. Full contact numbers on each listing." />
          <Link href="/jana-seva/blood/new">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Post Request
            </Button>
          </Link>
        </div>

        <FadeIn className="mt-6 flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Filter by city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="glass max-w-xs"
          />
          <Input
            placeholder="Blood group e.g. O+"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="glass max-w-xs"
          />
          <Button variant="outline" onClick={() => load()} className="glass">
            Apply
          </Button>
        </FadeIn>

        {loading ? (
          <PageLoader />
        ) : requests.length === 0 ? (
          <p className="mt-8 text-white/60">No open requests. Be the first to post one.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((r) => (
              <BloodRequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

export default function BloodRequestsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <BloodRequestsContent />
    </Suspense>
  );
}
