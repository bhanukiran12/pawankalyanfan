"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeading } from "@/components/layout/page-heading";
import { SidebarAd, InContentAd } from "@/components/ads/ad-block";
import { MovieFilters } from "@/components/movies/movie-filters";
import { MoviePoster } from "@/components/movies/movie-poster";
import { PageShell } from "@/components/layout/section-background";
import { PageLoader } from "@/components/ui/skeleton";
import { api, Movie } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

function MoviesContent() {
  const params = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query: Record<string, string> = { limit: "50" };
    ["q", "genre", "year"].forEach((k) => {
      const v = params.get(k);
      if (v) query[k] = v;
    });
    setLoading(true);
    api.getMovies(query).then((d) => setMovies(d.movies)).catch(() => setMovies([])).finally(() => setLoading(false));
  }, [params]);

  return (
    <div className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px]">
      <div>
        <Suspense fallback={<div className="h-10 animate-pulse bg-muted rounded-md" />}>
          <MovieFilters />
        </Suspense>
        {loading ? (
          <PageLoader />
        ) : (
          <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3">
            {movies.map((movie) => (
              <Link key={movie.id} href={`/movies/${movie.slug}`}>
                <Card className="group overflow-hidden hover:border-brand-red/30 transition-all h-full glass-card bg-card/75">
                  <div className="aspect-[2/3] relative bg-muted overflow-hidden">
                    <MoviePoster
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                    />
                    {movie.featured && <Badge className="absolute top-3 left-3">Featured</Badge>}
                  </div>
                  <CardContent className="p-4">
                    <h2 className="font-semibold group-hover:text-brand-red transition-colors">{movie.title}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(movie.releaseDate)}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(movie.genre ?? []).slice(0, 2).map((g) => (
                        <Badge key={g} variant="outline" className="text-[10px]">{g}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        <InContentAd />
      </div>
      <aside className="hidden lg:block"><SidebarAd /></aside>
    </div>
  );
}

export default function MoviesPage() {
  return (
    <PageShell background="movies">
      <div className="container-page py-6 sm:py-8">
        <FadeIn>
          <PageHeading title="His Cinema" subtitle="Every mass moment on screen" />
        </FadeIn>
        <Suspense fallback={<PageLoader />}>
          <MoviesContent />
        </Suspense>
      </div>
    </PageShell>
  );
}
