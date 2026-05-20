"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MoviePoster, posterSrc } from "@/components/movies/movie-poster";
import { PageShell } from "@/components/layout/section-background";
import { InContentAd } from "@/components/ads/ad-block";
import { PageLoader } from "@/components/ui/skeleton";
import { api, MovieDetail } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default function MovieDetailPage({ params }: { params: { slug: string } }) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    api.getMovie(params.slug)
      .then(setMovie)
      .catch(() => setNotFoundFlag(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <PageShell background="movies">
        <PageLoader />
      </PageShell>
    );
  }
  if (notFoundFlag || !movie) notFound();

  return (
    <PageShell background="movies" overlay="darker" className="min-h-screen">
      <>
      <section className="relative h-[38vh] min-h-[240px] sm:h-[45vh] sm:min-h-[320px] md:min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 overlay-radial-heavy z-10" aria-hidden />
        <div className="absolute inset-0 overlay-detail-linear z-10" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" aria-hidden />
        {movie.bannerUrl || movie.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterSrc(movie.bannerUrl || movie.posterUrl, 1600)}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-red/30 to-brand-black" />
        )}
        <div className="container-page relative z-20 flex h-full items-end pb-8 sm:pb-12">
          <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
              {movie.genre.map((g) => <Badge key={g}>{g}</Badge>)}
            </div>
            <h1 className="font-display text-3xl sm:text-5xl md:text-7xl tracking-wide leading-tight">{movie.title}</h1>
            <p className="mt-2 text-muted-foreground">{formatDate(movie.releaseDate)}</p>
          </div>
        </div>
      </section>

      <div className="container-page py-8 sm:py-12">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed">{movie.synopsis}</p>
            </section>
            <InContentAd />
            {movie.dialogues?.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Famous Dialogues</h2>
                <div className="space-y-3">
                  {movie.dialogues.map((d) => (
                    <Card key={d.id} className="glass-card"><CardContent className="p-4"><p className="italic">&ldquo;{d.text}&rdquo;</p></CardContent></Card>
                  ))}
                </div>
              </section>
            )}
          </div>
          <aside>
            {movie.cast?.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Cast</h2>
                <div className="space-y-3">
                  {movie.cast.map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{c.name[0]}</div>
                      <div><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.role}</p></div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
      </>
    </PageShell>
  );
}
