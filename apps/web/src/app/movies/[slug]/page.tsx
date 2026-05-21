"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Music2, Quote, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    api
      .getMovie(params.slug)
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
      <section className="relative min-h-[42vh] sm:min-h-[48vh] overflow-hidden">
        <div className="absolute inset-0 overlay-radial-heavy z-10" aria-hidden />
        <div className="absolute inset-0 overlay-detail-linear z-10" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30 z-10" aria-hidden />
        {movie.bannerUrl || movie.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterSrc(movie.bannerUrl || movie.posterUrl, 1600)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top scale-105 blur-sm opacity-60"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-red/30 to-brand-black" />
        )}

        <div className="container-page relative z-20 py-6 sm:py-10">
          <Link href="/movies">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 min-h-[44px] text-white/80 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              All movies
            </Button>
          </Link>

          <div className="grid gap-8 lg:grid-cols-[200px_1fr] xl:grid-cols-[240px_1fr] items-end">
            <div className="hidden sm:block">
              <div className="aspect-[2/3] rounded-xl overflow-hidden border border-white/15 cinematic-shadow shadow-2xl">
                <MoviePoster src={movie.posterUrl} alt={movie.title} className="h-full w-full" width={480} />
              </div>
            </div>
            <div className="min-w-0 pb-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {movie.featured && <Badge>Featured</Badge>}
                <span className="inline-flex items-center gap-1 rounded-md glass px-2.5 py-1 text-sm text-brand-gold">
                  <Star className="h-4 w-4 fill-brand-gold" />
                  {movie.rating.toFixed(1)} / 10
                </span>
                <span className="text-sm text-muted-foreground">{formatDate(movie.releaseDate)}</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide leading-[1.05]">
                {movie.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genre.map((g) => (
                  <Badge key={g} variant="outline">
                    {g}
                  </Badge>
                ))}
              </div>
              {movie.trailerUrl && (
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-5">
                  <Button variant="default" className="min-h-[44px]">
                    Watch trailer <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-page py-8 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
          <div className="space-y-10 min-w-0">
            <section className="rounded-xl glass-card p-5 sm:p-6 border border-white/10">
              <h2 className="font-display text-2xl tracking-wide mb-4">Synopsis</h2>
              <p className="text-white/85 leading-relaxed text-base sm:text-lg">{movie.synopsis}</p>
              {movie.trivia && (
                <p className="mt-4 pt-4 border-t border-white/10 text-sm text-muted-foreground italic">
                  {movie.trivia}
                </p>
              )}
            </section>

            <InContentAd />

            {movie.dialogues?.length > 0 && (
              <section>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="font-display text-2xl tracking-wide flex items-center gap-2">
                    <Quote className="h-6 w-6 text-brand-red" />
                    Famous dialogues
                  </h2>
                  <Link href="/quotes?category=MOVIE_DIALOGUE" className="text-xs text-brand-red hover:underline shrink-0">
                    More quotes →
                  </Link>
                </div>
                <div className="space-y-3">
                  {movie.dialogues.map((d) => (
                    <blockquote
                      key={d.id}
                      className="rounded-xl glass-card border-l-4 border-l-brand-red p-4 sm:p-5"
                    >
                      <p className="text-lg italic leading-relaxed text-white/90">&ldquo;{d.text}&rdquo;</p>
                      {d.context && (
                        <footer className="mt-2 text-xs text-muted-foreground">— {d.context}</footer>
                      )}
                    </blockquote>
                  ))}
                </div>
              </section>
            )}

            {movie.gallery?.length > 0 && (
              <section>
                <h2 className="font-display text-2xl tracking-wide mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {movie.gallery.map((img) => (
                    <div key={img.id} className="aspect-video rounded-lg overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.imageUrl}
                        alt={img.caption || movie.title}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="sm:hidden aspect-[2/3] max-w-[200px] mx-auto rounded-xl overflow-hidden border border-white/10 mb-6">
              <MoviePoster src={movie.posterUrl} alt={movie.title} className="h-full w-full" width={400} />
            </div>

            {movie.cast?.length > 0 && (
              <section className="rounded-xl glass-card p-5 border border-white/10">
                <h2 className="font-display text-xl tracking-wide mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-red" />
                  Cast
                </h2>
                <ul className="space-y-3">
                  {movie.cast.map((c) => (
                    <li key={c.id} className="flex items-center gap-3">
                      {c.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.imageUrl}
                          alt=""
                          className="h-11 w-11 rounded-full object-cover bg-muted"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-full bg-brand-red/20 flex items-center justify-center text-sm font-bold text-brand-red">
                          {c.name[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {movie.songs?.length > 0 && (
              <section className="rounded-xl glass-card p-5 border border-white/10">
                <h2 className="font-display text-xl tracking-wide mb-4 flex items-center gap-2">
                  <Music2 className="h-5 w-5 text-brand-red" />
                  Songs
                </h2>
                <ul className="space-y-2">
                  {movie.songs.map((s, i) => (
                    <li
                      key={s.id}
                      className="flex gap-3 text-sm py-2 border-b border-white/5 last:border-0"
                    >
                      <span className="text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                      <div>
                        <p className="font-medium">{s.title}</p>
                        {s.singer && <p className="text-xs text-muted-foreground">{s.singer}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="rounded-xl glass-card p-4 border border-white/10 text-sm space-y-2">
              <p className="text-muted-foreground">Explore more</p>
              <Link href="/wallpapers" className="block text-brand-red hover:underline">
                HD wallpapers
              </Link>
              <Link href="/quotes" className="block text-brand-red hover:underline">
                Iconic quotes
              </Link>
              <Link href="/events" className="block text-brand-red hover:underline">
                Event timeline
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
