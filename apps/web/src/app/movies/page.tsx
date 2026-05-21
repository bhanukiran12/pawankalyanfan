"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Film } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { SidebarAd, InContentAd } from "@/components/ads/ad-block";
import { MovieFilters } from "@/components/movies/movie-filters";
import { MovieCard, MovieCardSkeleton } from "@/components/movies/movie-card";
import { PageShell } from "@/components/layout/section-background";
import { FadeIn } from "@/components/motion/fade-in";
import { api, Movie } from "@/lib/api-client";

function MoviesContent() {
  const params = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const hasFilters = Boolean(params.get("q") || params.get("genre") || params.get("year"));

  useEffect(() => {
    const query: Record<string, string> = { limit: "50" };
    ["q", "genre", "year", "featured"].forEach((k) => {
      const v = params.get(k);
      if (v) query[k] = v;
    });
    setLoading(true);
    api
      .getMovies(query)
      .then((d) => setMovies(d.movies))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [params]);

  const sorted = useMemo(
    () =>
      [...movies].sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }),
    [movies],
  );

  return (
    <div className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px]">
      <div>
        <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-muted" />}>
          <MovieFilters />
        </Suspense>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `${sorted.length} film${sorted.length === 1 ? "" : "s"}`}
          </p>
          <Link href="/quotes?category=MOVIE_DIALOGUE" className="text-xs text-brand-red hover:underline shrink-0">
            Cinema quotes →
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-4 sm:gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="mt-12 rounded-xl glass-card border border-white/10 p-10 text-center">
            <Film className="h-10 w-10 text-brand-red/80 mx-auto mb-3" />
            <p className="font-medium">No movies match your filters</p>
            <p className="text-sm text-muted-foreground mt-1">Try another genre or clear search.</p>
            <Link href="/movies" className="inline-block mt-4 text-sm text-brand-red hover:underline">
              Show all films
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {sorted.map((movie, i) => (
              <FadeIn key={movie.id} delay={Math.min(i * 0.03, 0.3)}>
                <MovieCard movie={movie} />
              </FadeIn>
            ))}
          </div>
        )}
        <InContentAd />
      </div>
      <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
        <SidebarAd />
      </aside>
    </div>
  );
}

export default function MoviesPage() {
  return (
    <PageShell background="movies">
      <div className="container-page py-6 sm:py-8">
        <FadeIn>
          <PageHeading
            title="His Cinema"
            subtitle="Blockbusters, cult classics, and every Power Star moment — explore the full filmography."
          />
        </FadeIn>
        <Suspense
          fallback={
            <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <MoviesContent />
        </Suspense>
      </div>
    </PageShell>
  );
}
