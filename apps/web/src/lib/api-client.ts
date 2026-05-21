import { getGatewayOrigin } from "@/lib/gateway-url";

/** Browser uses same-origin /api (runtime proxy). SSR calls gateway directly when configured. */
function resolveApiBaseUrl(): string {
  const publicUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

  if (typeof window !== "undefined") {
    return publicUrl.startsWith("http") ? publicUrl.replace(/\/$/, "") : publicUrl;
  }

  const gateway = process.env.API_GATEWAY_URL || process.env.API_GATEWAY_HOST;
  if (gateway) {
    const base = getGatewayOrigin();
    return base.endsWith("/api") ? base : `${base}/api`;
  }

  if (publicUrl.startsWith("/")) {
    const site = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "http://localhost:3000";
    const origin = site.startsWith("http")
      ? site.replace(/\/$/, "")
      : site.includes(".")
        ? `https://${site.replace(/\/$/, "")}`
        : `http://localhost:3000`;
    return `${origin}${publicUrl}`;
  }

  return publicUrl.replace(/\/$/, "").endsWith("/api")
    ? publicUrl.replace(/\/$/, "")
    : `${publicUrl.replace(/\/$/, "")}/api`;
}

const API_URL = resolveApiBaseUrl();

type FetchOptions = RequestInit;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    let res: Response;
    try {
      res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
    } catch {
      throw new Error(
        "Cannot reach the API. For local dev run: npm run dev:local (or npm run dev:services and npm run dev:gateway in another terminal, plus npm run dev:web).",
      );
    }

    const json = await res.json();

    if (!res.ok || !json.success) {
      const hint =
        res.status === 503 && String(json.error || "").includes("gateway")
          ? " Start the API gateway: npm run dev:gateway"
          : "";
      throw new Error((json.error || `Request failed: ${res.status}`) + hint);
    }

    return json.data as T;
  }

  getHome() {
    return this.request<HomeData>("/home");
  }

  getMovies(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<{ movies: Movie[]; total: number }>(`/movies${qs}`);
  }

  getMovie(slug: string) {
    return this.request<MovieDetail>(`/movies/${slug}`);
  }

  getQuotes(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<{ quotes: Quote[]; total: number }>(`/quotes${qs}`);
  }

  getFanEdits(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<{ submissions: FanSubmission[]; total: number }>(`/fan-edits${qs}`);
  }

  getJanasenaNews() {
    return this.request<{ articles: JanasenaArticle[]; source: string }>("/janasena-news");
  }

  getJanasenaArticle(id: string) {
    return this.request<JanasenaArticle>(`/janasena-news/${id}`);
  }

  getPushPublicKey() {
    return this.request<{ publicKey: string }>("/push/vapid-public-key");
  }

  subscribePush(subscription: PushSubscriptionBody) {
    return this.request<{ subscribed: boolean }>("/push/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
    });
  }

  getNews(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<{ posts: NewsPost[]; total: number }>(`/news${qs}`);
  }

  getNewsPost(slug: string) {
    return this.request<NewsPost>(`/news/${slug}`);
  }

  getWallpapers(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<{ wallpapers: Wallpaper[]; total: number; page: number; totalPages: number }>(
      `/wallpapers${qs}`,
    );
  }

  getEvents(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<TimelineEvent[]>(`/events${qs}`);
  }

  getAdSlot(slot: string) {
    return this.request<{ enabled: boolean; adCode: string | null }>(`/ads/${slot}`);
  }

  chat(message: string, history?: { role: string; content: string }[]) {
    return this.request<{ response: string }>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    });
  }
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  releaseDate: string;
  posterUrl?: string | null;
  genre: string[];
  rating: number;
  featured: boolean;
  synopsis?: string;
}

export interface MovieDetail extends Movie {
  bannerUrl?: string | null;
  synopsis: string;
  trailerUrl?: string | null;
  trivia?: string | null;
  cast: { id: string; name: string; role: string; imageUrl?: string | null }[];
  dialogues: { id: string; text: string; context?: string | null }[];
  songs: { id: string; title: string; singer?: string | null }[];
  gallery: { id: string; imageUrl: string; caption?: string | null }[];
}

export interface Quote {
  id: string;
  text: string;
  slug: string;
  category: string;
  source?: string | null;
  movieTitle?: string | null;
  movieSlug?: string | null;
  speechSlug?: string | null;
  featured: boolean;
}

export interface JanasenaArticle {
  id: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  imageUrl: string | null;
  videoUrl: string | null;
  publishedAt: string;
  breaking: boolean;
  sourceUrl: string;
  siteUrl: string;
}

export interface PushSubscriptionBody {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export interface FanSubmission {
  id: string;
  title: string;
  description?: string | null;
  mediaUrl: string;
  mediaType: string;
  likeCount?: number;
  user?: { name: string | null };
  _count?: { likes: number };
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string;
  coverImage?: string | null;
  trending: boolean;
  publishedAt?: string | null;
  tags?: string[];
  authorName?: string;
}

export interface Wallpaper {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  thumbnailUrl?: string | null;
  tags?: string[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  imageUrl?: string | null;
}

export interface HomeData {
  movies: Movie[];
  quotes: Quote[];
  news: NewsPost[];
  wallpapers: Wallpaper[];
  events: TimelineEvent[];
}

export const api = new ApiClient(API_URL);
