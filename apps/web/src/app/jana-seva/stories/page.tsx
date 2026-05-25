"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/skeleton";
import { SuccessStoryCard } from "@/components/jana-seva/success-story-card";
import { api, type JanaSevaSuccessStory } from "@/lib/api-client";

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<JanaSevaSuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getSuccessStories()
      .then((d) => setStories(d.stories))
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell background="form" overlay="gradient">
      <div className="container-page py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <PageHeading
            title="Seva Stories"
            subtitle="Volunteers share who they helped — with photos, captions, and hashtags for the community."
          />
          <Link href="/jana-seva/stories/new">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Share Your Story
            </Button>
          </Link>
        </div>
        <Link href="/jana-seva" className="text-sm text-brand-red mt-2 inline-block">
          ← Jana Seva
        </Link>

        {loading ? (
          <PageLoader />
        ) : stories.length === 0 ? (
          <p className="mt-8 text-white/60">
            No stories yet.{" "}
            <Link href="/jana-seva/stories/new" className="text-brand-red hover:underline">
              Be the first to post your seva
            </Link>
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => (
              <SuccessStoryCard key={s.id} story={s} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
