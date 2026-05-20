"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InContentAd } from "@/components/ads/ad-block";
import { BlogHighlightBlocks } from "@/components/news/blog-highlight-blocks";
import { BlogLanguageToggle, BlogShareBar } from "@/components/news/blog-share-bar";
import { PageShell } from "@/components/layout/section-background";
import { PageLoader } from "@/components/ui/skeleton";
import { api, NewsPost } from "@/lib/api-client";
import { BlogLang, parseBlogContent, resolveBlogDisplay } from "@/lib/blog-highlights";
import { formatDate } from "@/lib/utils";

function ArticleBody({ content, lang }: { content: string; lang: BlogLang }) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  return (
    <div className="space-y-4 leading-relaxed text-white/90" lang={lang === "te" ? "te" : "en"}>
      {paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [lang, setLang] = useState<BlogLang>("te");

  useEffect(() => {
    api
      .getNewsPost(params.slug)
      .then((p) => {
        if (p.category !== "Blog") throw new Error("Not a blog");
        setPost(p);
      })
      .catch(() => setMissing(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  const parsed = useMemo(
    () => (post?.content ? parseBlogContent(post.content) : { highlights: [], body: "" }),
    [post?.content]
  );

  const display = useMemo(() => {
    if (!post) return null;
    return resolveBlogDisplay(parsed, { title: post.title, excerpt: post.excerpt }, lang);
  }, [post, parsed, lang]);

  if (loading) {
    return (
      <PageShell background="news">
        <PageLoader />
      </PageShell>
    );
  }
  if (missing || !post || !display) notFound();

  return (
    <PageShell background="news">
      <article className="container-page py-6 sm:py-8 max-w-3xl">
        <Link href="/blogs">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-white/70 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {lang === "te" ? "బ్లాగ్‌లకు తిరిగి" : "Back to Blogs"}
          </Button>
        </Link>

        <div className="mb-6">
          <BlogLanguageToggle lang={lang} onChange={setLang} />
        </div>

        <Badge className="mb-4">{lang === "te" ? "బ్లాగ్" : "Blog"}</Badge>
        <h1
          className={`page-title ${lang === "te" ? "leading-snug" : ""}`}
          lang={lang === "te" ? "te" : "en"}
        >
          {display.title}
        </h1>
        <p className="mt-4 text-sm text-white/70">
          {post.authorName} · {post.publishedAt ? formatDate(post.publishedAt) : ""}
        </p>
        <p className="mt-6 text-lg text-white/85" lang={lang === "te" ? "te" : "en"}>
          {display.excerpt}
        </p>

        {post.coverImage && (
          <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={display.title}
              className="w-full object-cover max-h-[420px]"
            />
          </div>
        )}

        {display.highlights.length > 0 && (
          <BlogHighlightBlocks highlights={display.highlights} className="mt-8" lang={lang} />
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.slice(0, 6).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-white/20">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <InContentAd />

        <div className="glass-card rounded-xl p-6 md:p-8 mt-8">
          {display.body ? <ArticleBody content={display.body} lang={lang} /> : null}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <BlogShareBar title={display.title} slug={post.slug} lang={lang} />
        </div>
      </article>
    </PageShell>
  );
}
