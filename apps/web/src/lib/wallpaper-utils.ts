import { SITE } from "./constants";

export function absoluteWallpaperUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const base =
    typeof window !== "undefined" ? window.location.origin : SITE.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const WALLPAPER_PAGE_SEO_TEXT =
  "Download free Pawan Kalyan UHD & 4K HD wallpapers — Power Star portraits, Jana Sena party politics, rally speeches, Bheemla Nayak & Vakeel Saab movie stills, Gabbar Singh, Telugu cinema fan art, mobile and desktop wallpapers.";

export function wallpaperSeoAlt(title: string): string {
  return `${title} | Pawan Kalyan Jana Sena Power Star HD wallpaper download — PawanKalyanFan`;
}

export function wallpaperSeoDescription(
  title: string,
  category: string,
  tags?: string[],
): string {
  const extra = tags?.slice(0, 4).join(", ") || "Power Star, Jana Sena, Telugu cinema";
  return `Download ${title} — free ${category.toLowerCase()} Pawan Kalyan UHD 4K wallpaper. ${extra}. HD mobile & desktop fan wallpapers at PawanKalyanFan.`;
}
