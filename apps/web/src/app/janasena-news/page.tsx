"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Bell } from "lucide-react";
import { toast } from "sonner";
import { api, JanasenaArticle } from "@/lib/api-client";
import { PageHeading } from "@/components/layout/page-heading";
import { PageShell } from "@/components/layout/section-background";
import { FadeIn } from "@/components/motion/fade-in";
import { PageLoader } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { pushSupported, subscribeToPushNotifications } from "@/lib/push-client";
import { SenaniStudentsCta } from "@/components/janasena/senani-students-cta";

export default function JanasenaNewsPage() {
  const [articles, setArticles] = useState<JanasenaArticle[]>([]);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [enabling, setEnabling] = useState(false);

  useEffect(() => {
    api
      .getJanasenaNews()
      .then((d) => {
        setArticles(d.articles);
        setSource(d.source);
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  async function enableAlerts() {
    setEnabling(true);
    try {
      const result = await subscribeToPushNotifications();
      if (result.ok) {
        toast.success("Notifications enabled!");
      } else if (result.reason === "denied") {
        toast.message("Notifications blocked in browser settings.");
      }
    } finally {
      setEnabling(false);
    }
  }

  return (
    <PageShell background="news">
      <div className="container-page py-6 sm:py-8">
        <FadeIn>
          <PageHeading
            title="Jana Sena News"
            subtitle="Latest updates from the official Jana Sena newsletter — synced for fans on this site."
          />
          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <a
              href="https://janasenanewsletter.com/news"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-red hover:underline inline-flex items-center gap-1"
            >
              janasenanewsletter.com <ExternalLink className="h-3.5 w-3.5" />
            </a>
            {pushSupported() && Notification.permission !== "granted" && (
              <Button size="sm" variant="outline" className="min-h-[40px]" disabled={enabling} onClick={enableAlerts}>
                <Bell className="h-4 w-4 mr-1.5" />
                {enabling ? "Enabling…" : "Get browser alerts"}
              </Button>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.05} className="mt-6 sm:mt-8">
          <SenaniStudentsCta />
        </FadeIn>

        {loading ? (
          <PageLoader />
        ) : articles.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">No news available right now.</p>
        ) : (
          <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/janasena-news/${article.id}`}
                className="group block rounded-xl glass-card overflow-hidden hover:border-brand-red/40 transition-colors"
              >
                {article.imageUrl && (
                  <div className="aspect-[16/9] bg-muted overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.breaking && <Badge variant="default">Breaking</Badge>}
                    <Badge variant="outline">Jana Sena</Badge>
                  </div>
                  <h2 className="font-semibold line-clamp-3 group-hover:text-brand-red transition-colors" lang="te">
                    {article.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3" lang="te">
                    {article.excerpt}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {formatDate(article.publishedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {source && (
          <p className="mt-8 text-center text-xs text-muted-foreground">
            News content sourced from{" "}
            <a href={source} className="text-brand-red hover:underline" target="_blank" rel="noopener noreferrer">
              Jana Sena Newsletter
            </a>
            . Unofficial fan mirror — not affiliated with Jana Sena Party.
          </p>
        )}
      </div>
    </PageShell>
  );
}
