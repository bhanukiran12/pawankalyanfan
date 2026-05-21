"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { api, JanasenaArticle } from "@/lib/api-client";
import { PageShell } from "@/components/layout/section-background";
import { PageLoader } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function JanasenaNewsDetailPage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<JanasenaArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getJanasenaArticle(params.id)
      .then(setArticle)
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <PageShell background="news">
        <PageLoader />
      </PageShell>
    );
  }

  if (!article) {
    return (
      <PageShell background="news">
        <div className="container-page py-12 text-center">
          <p className="text-muted-foreground">Article not found.</p>
          <Link href="/janasena-news" className="mt-4 inline-block text-brand-red hover:underline">
            Back to Jana Sena News
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell background="news">
      <article className="container-page py-6 sm:py-10 max-w-3xl">
        <Link href="/janasena-news">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2 min-h-[44px]">
            <ArrowLeft className="h-4 w-4 mr-1" /> All Jana Sena News
          </Button>
        </Link>

        <div className="flex flex-wrap gap-2 mb-3">
          {article.breaking && <Badge>Breaking</Badge>}
          <Badge variant="outline">Jana Sena Newsletter</Badge>
        </div>

        <h1 className="page-title text-left" lang="te">
          {article.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">{formatDate(article.publishedAt)}</p>

        {article.imageUrl && (
          <div className="mt-6 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt="" className="w-full h-auto" />
          </div>
        )}

        <div
          className="prose prose-invert max-w-none mt-8 text-white/90 leading-relaxed janasena-article"
          lang="te"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        <div className="mt-10 flex flex-wrap gap-3">
          <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="min-h-[44px]">
              Read on newsletter site <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </a>
        </div>
      </article>
    </PageShell>
  );
}
