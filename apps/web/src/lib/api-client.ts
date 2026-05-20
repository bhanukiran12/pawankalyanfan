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
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error || `Request failed: ${res.status}`);
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

  getEvents() {
    return this.request<TimelineEvent[]>("/events");
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
  featured: boolean;
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
