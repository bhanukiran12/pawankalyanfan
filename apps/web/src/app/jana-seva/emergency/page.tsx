"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/skeleton";
import { EMERGENCY_CATEGORY_LABELS } from "@/lib/jana-seva";
import { api, type EmergencyPost } from "@/lib/api-client";

export default function EmergencyBoardPage() {
  const [posts, setPosts] = useState<EmergencyPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getEmergencyPosts()
      .then((d) => setPosts(d.posts))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell background="form" overlay="dark">
      <div className="container-page py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <PageHeading title="Emergency Help Board" subtitle="Live community help posts with contact numbers." />
          <Link href="/jana-seva/need-help">
            <Button className="w-full sm:w-auto">Post Help Request</Button>
          </Link>
        </div>
        <Link href="/jana-seva" className="text-sm text-brand-red mt-2 inline-block">
          ← Jana Seva
        </Link>
        {loading ? (
          <PageLoader />
        ) : posts.length === 0 ? (
          <p className="mt-8 text-white/60">No verified emergencies right now.</p>
        ) : (
          <div className="mt-8 space-y-4 max-w-2xl">
            {posts.map((p) => (
              <Card key={p.id} className="glass border-amber-500/30">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                      <p className="text-sm text-white/70 mt-3">{p.description}</p>
                      <p className="text-xs text-white/45 mt-2">
                        {p.city} · {EMERGENCY_CATEGORY_LABELS[p.category] || p.category}
                      </p>
                      <p className="text-sm text-brand-red mt-2">{p.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
