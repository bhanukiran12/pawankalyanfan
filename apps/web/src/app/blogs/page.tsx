"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/constants";
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

function BlogsJsonLd({ posts }: { posts: NewsPost[] }) {
  useEffect(() => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Pawan Kalyan Fan Blogs",
      description: "Pawan Kalyan news, movies, politics, and Power Star guides",
      url: `${SITE.url.replace(/\/$/, "")}/blogs`,
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
      blogPost: posts.slice(0, 20).map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        description: p.excerpt,
        url: `${SITE.url.replace(/\/$/, "")}/blogs/${p.slug}`,
        datePublished: p.publishedAt,
      })),
    };
    const id = "blogs-jsonld";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => script?.remove();
  }, [posts]);
  return null;
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<BlogLang>("te");

  useEffect(() => {
    api
      .getNews({ category: "Blog", limit: "60" })
      .then((d) => setPosts(d.posts))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell background="news">
      <BlogsJsonLd posts={posts} />
      <div className="container-page py-6 sm:py-8">
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="page-title">
                {lang === "te" ? "పవన్ కళ్యాణ్ బ్లాగ్‌లు" : "Pawan Kalyan Blogs"}
              </h1>
              <p className="page-subtitle">
                {lang === "te"
                  ? "పవన్ కళ్యాణ్ తాజా వార్తలు, సినిమాలు, జనసేన, Power Star గైడ్‌లు — అధికారికం కాదు, ఫ్యాన్ ట్రిబ్యూట్"
                  : "Latest Pawan Kalyan news, movies, Jana Sena, Deputy CM updates, OG & HHVM — Power Star / PSPK guides for fans (unofficial tribute)."}
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
