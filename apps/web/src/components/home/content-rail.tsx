"use client";

import Link from "next/link";
import { MoviePoster } from "@/components/movies/movie-poster";
import { FadeIn } from "@/components/motion/fade-in";

type Item = {
  id: string;
  title: string;
  href: string;
  image?: string | null;
  subtitle?: string;
};

export function ContentRail({ items }: { items: Item[] }) {
  if (!items.length) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="scrollbar-rail -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3 sm:gap-4 overflow-x-auto pb-5 pt-1 snap-x snap-mandatory overscroll-x-contain">
      {items.map((item, i) => (
        <FadeIn key={item.id} delay={i * 0.05} className="snap-start shrink-0 w-[9.5rem] sm:w-40 md:w-48">
          <Link href={item.href} className="group block">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted cinematic-shadow">
              <MoviePoster
                src={item.image}
                alt={item.title}
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                width={400}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-brand-red transition-colors">{item.title}</h3>
            {item.subtitle && <p className="text-xs text-muted-foreground">{item.subtitle}</p>}
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}
