export type NewsSeed = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  sourceUrl: string;
  publishedAt: string;
  featured: boolean;
};

export const news: NewsSeed[] = [
  {
    title: "OG Production Update Excites Fans",
    slug: "og-production-update-excites-fans",
    category: "Movies",
    excerpt: "Production progress around OG continues to generate fan excitement.",
    sourceUrl: "https://www.123telugu.com/category/mnews",
    publishedAt: "2026-01-10",
    featured: true,
  },
  {
    title: "Hari Hara Veera Mallu Team Shares Update",
    slug: "hhvm-team-update",
    category: "Movies",
    excerpt: "Latest production developments shared with audiences.",
    sourceUrl: "https://www.gulte.com/movienews",
    publishedAt: "2026-01-15",
    featured: true,
  },
  {
    title: "Jana Sena Rally Draws Public Attention",
    slug: "jana-sena-rally-public-attention",
    category: "Politics",
    excerpt: "Large public gathering highlights political momentum.",
    sourceUrl: "https://www.thehindu.com/news/national/andhra-pradesh/",
    publishedAt: "2026-01-18",
    featured: true,
  },
  {
    title: "Bheemla Nayak Continues Fan Celebrations",
    slug: "bheemla-nayak-fan-celebrations",
    category: "Fan Events",
    excerpt: "Fan communities continue celebrating milestone moments.",
    sourceUrl: "https://www.telugu360.com/",
    publishedAt: "2026-01-20",
    featured: false,
  },
  {
    title: "Classic Movie Anniversary Fan Meet",
    slug: "classic-movie-anniversary-fan-meet",
    category: "Fan Events",
    excerpt: "Fans organize commemorative celebration events.",
    sourceUrl: "https://www.greatandhra.com/",
    publishedAt: "2026-01-22",
    featured: false,
  },
  {
    title: "Political Commentary Around Public Address",
    slug: "political-commentary-public-address",
    category: "Politics",
    excerpt: "Discussion grows around recent public speech.",
    sourceUrl: "https://indianexpress.com/section/india/",
    publishedAt: "2026-01-25",
    featured: false,
  },
  {
    title: "Upcoming Film Buzz Builds Online",
    slug: "upcoming-film-buzz-builds-online",
    category: "Movies",
    excerpt: "Online fan communities increase anticipation.",
    sourceUrl: "https://timesofindia.indiatimes.com/entertainment/telugu/movies/news",
    publishedAt: "2026-01-28",
    featured: false,
  },
  {
    title: "Fan Art Competition Announced",
    slug: "fan-art-competition-announced",
    category: "Community",
    excerpt: "Digital fan communities launch creative challenge.",
    sourceUrl: "https://www.behance.net/",
    publishedAt: "2026-02-01",
    featured: false,
  },
  {
    title: "Vintage Speech Clips Trend Again",
    slug: "vintage-speech-clips-trend",
    category: "Media",
    excerpt: "Older speeches resurface and gain traction.",
    sourceUrl: "https://www.youtube.com/",
    publishedAt: "2026-02-05",
    featured: false,
  },
  {
    title: "Community Discussion Around New Releases",
    slug: "community-discussion-new-releases",
    category: "Community",
    excerpt: "Forum participation rises around new updates.",
    sourceUrl: "https://reddit.com/",
    publishedAt: "2026-02-07",
    featured: false,
  },
];

export function newsPayload(item: NewsSeed) {
  return {
    title: item.title,
    excerpt: item.excerpt,
    content: `${item.excerpt}\n\nThis is a fan-community news roundup. For full coverage, visit the original source.\n\nSource: ${item.sourceUrl}`,
    category: item.category,
    tags: [item.category, "Pawan Kalyan"],
    published: true,
    featured: item.featured,
    trending: item.featured,
    publishedAt: new Date(item.publishedAt),
  };
}
