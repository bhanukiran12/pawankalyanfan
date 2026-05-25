function publicSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://pawankalyanfan.com";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw.replace(/\/$/, "");
  return `https://${raw.replace(/\/$/, "")}`;
}

export const SITE = {
  name: "PawanKalyanFan",
  url: publicSiteUrl(),
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

/** Senani Students Wing — external registration (official wing form). */
export const SENANI_STUDENTS_WING = {
  name: "Senani Students Wing",
  registrationUrl: "https://senanistudentswing.rf.gd/forms/survey.php?i=1",
  websiteUrl: "https://senanistudentswing.rf.gd",
  flyerImage: "/janasena/senani-students-wing-flyer.png",
} as const;

/** Top header + mobile menu (PK Birthday is footer-only). */
export const NAV_LINKS = [
  { href: "/movies", label: "Movies" },
  { href: "/jana-seva", label: "Jana Seva" },
  { href: "/janasena-news", label: "Jana Sena News" },
  { href: "/janasena-students", label: "Students Wing" },
  { href: "/quotes", label: "Quotes" },
  { href: "/wallpapers", label: "Wallpapers" },
  { href: "/blogs", label: "Blogs" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Partnerships" },
] as const;

/** Footer menu includes header links plus PK Birthday countdown page. */
export const FOOTER_NAV_LINKS = [
  ...NAV_LINKS,
  { href: "/pk-birthday", label: "PK Birthday" },
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
