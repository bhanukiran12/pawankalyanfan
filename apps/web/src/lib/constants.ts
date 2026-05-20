export const SITE = {
  name: "PawanKalyanFan",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pawankalyanfan.com",
  logo: "https://res.cloudinary.com/df7wnybwg/image/upload/v1779281316/pawankalaynfan/movies/pawan_kalayn_fan_logo_tuzxjy.png",
  /** Visible on-site tagline — single fan voice, no feature lists */
  tagline: "Built by a fan. For every soul that stands with Pawan Kalyan.",
  /** SEO / meta only — keywords allowed here, not shown in page body */
  seoDescription:
    "Pawan Kalyan fan website — Power Star movies, iconic dialogues, Jana Sena party politics & speeches, HD UHD 4K wallpapers, blogs, events, quotes, Telugu cinema filmography, Gabbar Singh, Bheemla Nayak, Vakeel Saab, and a personal PK fan tribute.",
  disclaimer:
    "This website is an unofficial fan-created tribute and is not affiliated with or endorsed by Pawan Kalyan or any official organization.",
  contactEmail: "admin@pawankalyanfan.com",
  locale: "en_IN",
} as const;

export const NAV_LINKS = [
  { href: "/movies", label: "Movies" },
  { href: "/quotes", label: "Quotes" },
  { href: "/wallpapers", label: "Wallpapers" },
  { href: "/blogs", label: "Blogs" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Partnerships" },
] as const;

export const QUOTE_CATEGORIES = [
  { value: "MOTIVATIONAL", label: "Motivational" },
  { value: "POLITICAL", label: "Political" },
  { value: "MOVIE_DIALOGUE", label: "Cinema & Life" },
  { value: "DEVOTIONAL", label: "Devotional" },
  { value: "LEADERSHIP", label: "Leadership" },
] as const;

/** Cloudinary section backgrounds — one per major page/area */
export const SECTION_BACKGROUNDS = {
  home: "https://res.cloudinary.com/df7wnybwg/image/upload/v1779278226/pawankalaynfan/movies/bg_pawankalyan_coitkp.jpg",
  movies: "https://res.cloudinary.com/df7wnybwg/image/upload/v1779278381/pawankalaynfan/movies/movies_bg_scgopg.jpg",
  quotes: "https://res.cloudinary.com/df7wnybwg/image/upload/v1779278553/pawankalaynfan/movies/quotes_BG_fnsva7.jpg",
  wallpapers: "https://res.cloudinary.com/df7wnybwg/image/upload/v1779278601/pawankalaynfan/movies/pawan_kalyan_wallpaper_gvbm1l.jpg",
  news: "https://res.cloudinary.com/df7wnybwg/image/upload/v1779278844/pawankalaynfan/movies/pawan_kalyan_news_k86kyl.jpg",
  events: "https://res.cloudinary.com/df7wnybwg/image/upload/v1779279239/pawankalaynfan/movies/pawan_kalayn_events_frb9kq.jpg",
  form: "https://res.cloudinary.com/df7wnybwg/image/upload/v1779279240/pawankalaynfan/movies/pawan_kalayan_form_vvewta.jpg",
} as const;

export type SectionBackgroundKey = keyof typeof SECTION_BACKGROUNDS;

export const AD_SLOTS = [
  "header",
  "sidebar",
  "in-content",
  "footer",
  "mobile-sticky",
] as const;

export function mailtoLink(subject: string, body?: string) {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  return `mailto:${SITE.contactEmail}?${params.toString()}`;
}
