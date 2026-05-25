"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { JanaSevaSuccessStory } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export function SuccessStoryCard({ story }: { story: JanaSevaSuccessStory }) {
  const cover = story.photoUrls[0];
  return (
    <Link href={`/jana-seva/stories/${story.slug}`}>
      <Card className="glass border-white/10 h-full overflow-hidden hover:border-brand-red/40 transition-colors">
        {cover && (
          <div className="aspect-[16/10] bg-black/40 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}
        <CardContent className="p-4">
          <Badge className="bg-brand-red/90 text-white border-0 text-xs mb-2">{story.sevaTypeLabel}</Badge>
          <p className="text-white font-medium line-clamp-2">{story.caption}</p>
          <p className="text-sm text-white/60 mt-2 line-clamp-1">🙏 {story.helpedDisplay}</p>
          <p className="text-xs text-white/45 mt-2">
            {story.volunteerName} · {formatDate(story.createdAt)}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {story.hashtags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-xs text-brand-red/90">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
