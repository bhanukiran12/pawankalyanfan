"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/ui/skeleton";
import { JanaSevaSocialShare } from "@/components/jana-seva/jana-seva-social-share";
import { api, type JanaSevaSuccessStory } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default function SuccessStoryDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [story, setStory] = useState<JanaSevaSuccessStory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api
      .getSuccessStory(slug)
      .then(setStory)
      .catch(() => setStory(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PageShell background="form" overlay="gradient">
        <div className="container-page py-12">
          <PageLoader />
        </div>
      </PageShell>
    );
  }

  if (!story) {
    return (
      <PageShell background="form" overlay="gradient">
        <div className="container-page py-12 text-white/60">Story not found.</div>
      </PageShell>
    );
  }

  return (
    <PageShell background="form" overlay="gradient">
      <div className="container-page py-8 sm:py-12 max-w-2xl">
        <Link href="/jana-seva/stories" className="text-sm text-white/60 hover:text-white inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> All seva stories
        </Link>

        <div className="mt-6">
          <Badge className="bg-brand-red text-white border-0">{story.sevaTypeLabel}</Badge>
          <PageHeading title="Seva Story" subtitle={`${story.volunteerName} · ${formatDate(story.createdAt)}`} />
        </div>

        <div className="mt-6 grid gap-3">
          {story.photoUrls.map((url, i) => (
            <div key={url} className="rounded-xl overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Story photo ${i + 1}`} className="w-full h-auto object-cover" loading="lazy" />
            </div>
          ))}
        </div>

        <p className="mt-6 text-lg text-white whitespace-pre-wrap">{story.caption}</p>
        <p className="mt-4 text-white/75">
          <span className="text-brand-red font-medium">Helped:</span> {story.helpedDisplay}
        </p>
        {(story.city || story.state) && (
          <p className="text-sm text-white/50 mt-2">
            {[story.city, story.state].filter(Boolean).join(", ")}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {story.hashtags.map((tag) => (
            <span key={tag} className="text-sm text-brand-red/90">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl border border-white/10 bg-black/50">
          <p className="text-sm text-white/70 mb-4">Share this story on social media</p>
          <JanaSevaSocialShare share={story.share} />
        </div>
      </div>
    </PageShell>
  );
}
