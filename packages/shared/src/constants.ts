export const SITE = {
  name: "PawanKalyanFan",
  url: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://pawankalyanfan.com",
  description:
    "The ultimate unofficial fan community for Pawan Kalyan — movies, quotes, wallpapers, fan edits, and premium membership.",
  disclaimer:
    "This website is an unofficial fan-created community and is not affiliated with or endorsed by Pawan Kalyan or any official organization.",
  twitter: "@PawanKalyanFan",
  locale: "en_IN",
} as const;

export const MEMBERSHIP = {
  planName: "Premium Fan",
  amountPaise: 9900,
  amountDisplay: "₹99",
  interval: "month",
  features: [
    "Exclusive HD wallpapers",
    "HD quote poster downloads",
    "Members-only forum discussions",
    "Early access to new content",
    "Premium badge on profile",
    "AI quote voice generator access",
  ],
} as const;

export const SERVICE_PORTS = {
  GATEWAY: 4000,
  AUTH: 4001,
  CONTENT: 4002,
  COMMUNITY: 4003,
  BILLING: 4004,
  AI: 4005,
  CHARITY: 4006,
} as const;

export const SERVICE_URLS = {
  AUTH: process.env.AUTH_SERVICE_URL || `http://localhost:${SERVICE_PORTS.AUTH}`,
  CONTENT: process.env.CONTENT_SERVICE_URL || `http://localhost:${SERVICE_PORTS.CONTENT}`,
  COMMUNITY: process.env.COMMUNITY_SERVICE_URL || `http://localhost:${SERVICE_PORTS.COMMUNITY}`,
  BILLING: process.env.BILLING_SERVICE_URL || `http://localhost:${SERVICE_PORTS.BILLING}`,
  AI: process.env.AI_SERVICE_URL || `http://localhost:${SERVICE_PORTS.AI}`,
  CHARITY: process.env.CHARITY_SERVICE_URL || `http://localhost:${SERVICE_PORTS.CHARITY}`,
} as const;

export const AD_SLOTS = ["header", "sidebar", "in-content", "footer", "mobile-sticky"] as const;

export const QUOTE_CATEGORIES = [
  { value: "MOTIVATIONAL", label: "Motivational" },
  { value: "POLITICAL", label: "Political" },
  { value: "MOVIE_DIALOGUE", label: "Movie Dialogues" },
  { value: "DEVOTIONAL", label: "Devotional" },
  { value: "LEADERSHIP", label: "Leadership" },
] as const;
