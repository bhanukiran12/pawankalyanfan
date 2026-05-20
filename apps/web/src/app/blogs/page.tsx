"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { BlogHighlightBlocks } from "@/components/news/blog-highlight-blocks";
import { BlogLanguageToggle } from "@/components/news/blog-share-bar";
import { PageShell } from "@/components/layout/section-background";
import { PageLoader } from "@/components/ui/skeleton";
import { api, NewsPost } from "@/lib/api-client";
import { BlogLang, parseBlogContent, resolveBlogDisplay } from "@/lib/blog-highlights";
import { formatDate } from "@/lib/utils";

function BlogCard({ post, lang }: { post: NewsPost; lang: BlogLang }) {
  const parsed = post.content ? parseBlogContent(post.content) : { highlights: [], body: "" };
  const display = resolveBlogDisplay(parsed, { title: post.title, excerpt: post.excerpt }, lang);
  const previewHighlights = display.highlights.slice(0, 2);

  return (
    <Card className="group h-full overflow-hidden hover:border-brand-red/30 transition-all glass-card bg-card/75">
      {post.coverImage && (
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      {previewHighlights.length > 0 && (
        <div className="p-4 pb-0">
          <BlogHighlightBlocks highlights={previewHighlights} compact className="!grid-cols-1" lang={lang} />
        </div>
      )}
      <CardContent className="p-5">
        <Badge variant="outline" className="mb-2">
          {lang === "te" ? "బ్లాగ్" : "Blog"}
        </Badge>
        <h2
          className="font-semibold group-hover:text-brand-red line-clamp-2"
          lang={lang === "te" ? "te" : "en"}
        >
          {display.title}
        </h2>
        <p
          className="mt-2 text-sm text-muted-foreground line-clamp-3"
          lang={lang === "te" ? "te" : "en"}
        >
          {display.excerpt}
        </p>
        {post.publishedAt && (
          <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<BlogLang>("te");

  useEffect(() => {
    api
      .getNews({ category: "Blog", limit: "30" })
      .then((d) => setPosts(d.posts))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell background="news">
      <div className="container-page py-6 sm:py-8">
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="page-title">
                {lang === "te" ? "బ్లాగ్‌లు" : "Blogs"}
              </h1>
              <p className="page-subtitle">
                {lang === "te"
                  ? "ఉప ముఖ్యమంత్రి పవన్ కళ్యాణ్ — రాజకీయ ప్రయాణం, పాలన, జనసేన & Andhra Pradesh అభివృద్ధి"
                  : "Deputy CM Pawan Kalyan — political journey, governance, Jana Sena & Andhra Pradesh development"}
              </p>
            </div>
            <BlogLanguageToggle lang={lang} onChange={setLang} />
          </div>
        </FadeIn>
        {loading ? (
          <PageLoader />
        ) : posts.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">No blogs yet.</p>
        ) : (
          <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blogs/${post.slug}`}>
                <BlogCard post={post} lang={lang} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
