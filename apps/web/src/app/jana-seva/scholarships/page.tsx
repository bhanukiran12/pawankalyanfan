"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { PageShell } from "@/components/layout/section-background";
import { PageHeading } from "@/components/layout/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/skeleton";
import { api, type Scholarship } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default function ScholarshipsPage() {
  const [items, setItems] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getScholarships()
      .then((d) => setItems(d.scholarships))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell background="form" overlay="gradient">
      <div className="container-page py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <PageHeading title="Education & Scholarships" subtitle="Share or discover scholarships, coaching, and mentorship." />
          <Link href="/jana-seva/scholarships/new">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Share Opportunity
            </Button>
          </Link>
        </div>
        <Link href="/jana-seva" className="text-sm text-brand-red mt-2 inline-block">
          ← Jana Seva
        </Link>
        {loading ? (
          <PageLoader />
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.map((s) => (
              <Card key={s.id} className="glass border-white/10">
                <CardContent className="p-5">
                  <h3 className="font-display text-xl text-white">{s.title}</h3>
                  <p className="text-sm text-white/60">{s.provider}</p>
                  {s.amount && <p className="text-brand-gold mt-2">{s.amount}</p>}
                  <p className="text-xs text-white/45 mt-2">Deadline {formatDate(s.deadline)}</p>
                  <a href={s.applicationUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4">
                    <Button size="sm" variant="outline" className="glass">
                      Apply <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
