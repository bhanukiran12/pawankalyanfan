"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Cloudinary transform for reliable poster delivery in cards. */
export function posterSrc(url: string | null | undefined, width = 600): string | undefined {
  if (!url) return undefined;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_fill,w_${width},h_${Math.round(width * 1.5)}/`);
}

type MoviePosterProps = {
  src?: string | null;
  alt: string;
  className?: string;
  width?: number;
};

export function MoviePoster({ src, alt, className, width = 600 }: MoviePosterProps) {
  const [failed, setFailed] = useState(false);
  const optimized = posterSrc(src, width);

  if (!optimized || failed) {
    return (
      <div className={cn("flex items-center justify-center bg-gradient-to-b from-brand-red/20 to-brand-black", className)}>
        <span className="font-display text-4xl text-brand-red">PK</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={optimized}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
