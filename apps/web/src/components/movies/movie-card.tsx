"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MoviePoster } from "@/components/movies/movie-poster";
import type { Movie } from "@/lib/api-client";

function releaseYear(date: string): string {
  return new Date(date).getFullYear().toString();
}

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.slug}`} className="group block h-full">
      <article className="relative h-full overflow-hidden rounded-xl glass-card border border-white/10 transition-all duration-300 hover:border-brand-red/50 hover:shadow-[0_12px_40px_rgba(220,38,38,0.15)] cinematic-shadow">
        <div className="aspect-[2/3] relative overflow-hidden bg-muted">
          <MoviePoster
            src={movie.posterUrl}
            alt={movie.title}
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            width={480}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
          {movie.featured && (
            <div className="absolute top-2.5 left-2.5">
              <Badge className="shadow-lg text-[10px]">Featured</Badge>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/60 mb-1">
              {releaseYear(movie.releaseDate)}
            </p>
            <h2 className="font-display text-lg sm:text-xl tracking-wide leading-tight text-white line-clamp-2 group-hover:text-brand-red-light transition-colors">
              {movie.title}
            </h2>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="rounded-xl glass-card overflow-hidden border border-white/10 animate-pulse">
      <div className="aspect-[2/3] bg-muted" />
    </div>
  );
}
