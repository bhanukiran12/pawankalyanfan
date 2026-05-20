"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { PageShell } from "@/components/layout/section-background";
import { PageLoader } from "@/components/ui/skeleton";
import { EventsTimeline } from "@/components/events/timeline";
import { api, TimelineEvent } from "@/lib/api-client";

export default function EventsPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvents().then(setEvents).finally(() => setLoading(false));
  }, []);

  return (
    <PageShell background="events" overlay="events">
      <div className="container-page py-6 sm:py-8 px-4 sm:px-6">
        <FadeIn className="text-center max-w-2xl mx-auto">
          <h1 className="page-title">Event Timeline</h1>
          <p className="page-subtitle mx-auto">
            Cinema milestones, Jana Sena politics, speeches, and defining moments of Power Star
            Pawan Kalyan
          </p>
        </FadeIn>
        {loading ? (
          <PageLoader />
        ) : (
          <EventsTimeline events={events} />
        )}
      </div>
    </PageShell>
  );
}
