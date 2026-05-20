"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { PageShell } from "@/components/layout/section-background";
import { PageLoader } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { api, Wallpaper } from "@/lib/api-client";
import { SITE } from "@/lib/constants";
import {
  absoluteWallpaperUrl,
  wallpaperSeoAlt,
  wallpaperSeoDescription,
  WALLPAPER_PAGE_SEO_TEXT,
} from "@/lib/wallpaper-utils";

const PAGE_SIZE = 24;

function WallpapersJsonLd({ wallpapers }: { wallpapers: Wallpaper[] }) {
  useEffect(() => {
    const siteUrl = SITE.url.replace(/\/$/, "");
    const data = {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "Pawan Kalyan HD Wallpapers — Power Star, Jana Sena, Movies",
      description: WALLPAPER_PAGE_SEO_TEXT,
      url: `${siteUrl}/wallpapers`,
      keywords: [
        "Pawan Kalyan wallpaper",
        "Power Star HD wallpaper",
        "Jana Sena party wallpaper",
        "Pawan Kalyan politics",
        "Pawan Kalyan speeches",
        "Bheemla Nayak wallpaper",
        "Vakeel Saab wallpaper",
        "Telugu cinema wallpaper",
      ].join(", "),
      image: wallpapers.map((wp) => ({
        "@type": "ImageObject",
        name: wp.title,
        description: wallpaperSeoDescription(wp.title, wp.tags?.[0] || "Portrait", wp.tags),
        contentUrl: absoluteWallpaperUrl(wp.imageUrl),
        thumbnailUrl: absoluteWallpaperUrl(wp.thumbnailUrl || wp.imageUrl),
        author: { "@type": "Organization", name: SITE.name },
      })),
    };

    const id = "wallpapers-jsonld";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => script?.remove();
  }, [wallpapers]);

  return null;
}

export default function WallpapersPage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback((pageNum: number, q: string) => {
    setLoading(true);
    const params: Record<string, string> = {
      page: String(pageNum),
      limit: String(PAGE_SIZE),
    };
    if (q.trim()) params.q = q.trim();

    api
      .getWallpapers(params)
      .then((d) => {
        setWallpapers(d.wallpapers);
        setTotalPages(d.totalPages ?? Math.max(1, Math.ceil(d.total / PAGE_SIZE)));
      })
      .catch(() => {
        setWallpapers([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(page, query);
  }, [page, query, load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  return (
    <PageShell background="wallpapers">
      <WallpapersJsonLd wallpapers={wallpapers} />
      <div className="container-page py-6 sm:py-8">
        <FadeIn>
          <PageHeading title="Pawan Kalyan Wallpapers" subtitle={WALLPAPER_PAGE_SEO_TEXT} />
        </FadeIn>

        <form onSubmit={handleSearch} className="mt-4 sm:mt-6 w-full max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50 pointer-events-none" />
            <Input
              type="search"
              placeholder="Search wallpapers — Jana Sena, Bheemla Nayak, politics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-card border-white/20 bg-black/40 pl-10 text-base min-h-[48px] w-full"
              aria-label="Search wallpapers"
            />
          </div>
        </form>

        {loading ? (
          <PageLoader />
        ) : wallpapers.length === 0 ? (
          <p className="mt-12 text-center text-white/60">No wallpapers match your search.</p>
        ) : (
          <>
            <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {wallpapers.map((wp) => {
                const src = wp.imageUrl.startsWith("http") ? wp.imageUrl : wp.imageUrl;
                const fullUrl = absoluteWallpaperUrl(wp.imageUrl);
                const alt = wallpaperSeoAlt(wp.title);
                const description = wallpaperSeoDescription(
                  wp.title,
                  wp.tags?.[0] || "Portrait",
                  wp.tags,
                );

                return (
                  <figure
                    key={wp.id}
                    itemScope
                    itemType="https://schema.org/ImageObject"
                    className="group relative aspect-[3/4] overflow-hidden rounded-lg glass-card bg-black/50"
                  >
                    <meta itemProp="name" content={wp.title} />
                    <meta itemProp="description" content={description} />
                    <meta itemProp="contentUrl" content={fullUrl} />
                    <link itemProp="url" href={fullUrl} />
                    <a
                      href={fullUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                      aria-label={`Download ${wp.title}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={alt}
                        title={wp.title}
                        itemProp="thumbnail"
                        className="absolute inset-0 h-full w-full object-contain transition-transform group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8">
                        <figcaption itemProp="caption" className="text-sm font-medium line-clamp-2">
                          {wp.title}
                        </figcaption>
                        <span className="mt-1 flex items-center gap-1 text-xs text-white/70">
                          <Download className="h-3 w-3" /> Download UHD
                        </span>
                      </div>
                    </a>
                  </figure>
                );
              })}
            </div>

            {totalPages > 1 && (
              <nav
                className="mt-10 flex flex-wrap items-center justify-center gap-4"
                aria-label="Wallpapers pagination"
              >
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm min-h-[48px] min-w-[120px] disabled:opacity-40 active:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="text-sm text-white/70">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm min-h-[48px] min-w-[120px] disabled:opacity-40 active:bg-white/10"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
