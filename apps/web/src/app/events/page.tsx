"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FadeIn } from "@/components/motion/fade-in";
import { PageShell } from "@/components/layout/section-background";
import { PageLoader } from "@/components/ui/skeleton";
import { EventsTimeline } from "@/components/events/timeline";
import { api, TimelineEvent } from "@/lib/api-client";

function EventsPageContent() {
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get("type")?.toUpperCase() ?? "";
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = typeFilter ? { type: typeFilter } : undefined;
    api
      .getEvents(params)
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [typeFilter]);

  return (
    <>
      <FadeIn className="text-center max-w-2xl mx-auto">
        <h1 className="page-title">Event Timeline</h1>
        <p className="page-subtitle mx-auto">
          {typeFilter === "SPEECH"
            ? "Speeches and public addresses — then explore related quotes and films."
            : "Cinema milestones, Jana Sena politics, speeches, and defining moments of Power Star Pawan Kalyan"}
        </p>
      </FadeIn>
      {loading ? <PageLoader /> : <EventsTimeline events={events} />}
    </>
  );
}

export default function EventsPage() {
  return (
    <PageShell background="events" overlay="events">
      <div className="container-page py-6 sm:py-8 px-4 sm:px-6">
        <Suspense fallback={<PageLoader />}>
          <EventsPageContent />
        </Suspense>
      </div>
    </PageShell>
  );
}
