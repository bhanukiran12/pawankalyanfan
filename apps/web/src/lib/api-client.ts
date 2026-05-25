import { getGatewayOrigin } from "@/lib/gateway-url";
import { JANA_SEVA_SESSION_KEY } from "@/lib/jana-seva";

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

  private janaSevaHeaders(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const token = sessionStorage.getItem(JANA_SEVA_SESSION_KEY);
    return token ? { "X-Jana-Seva-Session": token } : {};
  }

  private charityRequest<T>(path: string, options: FetchOptions = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      headers: { ...this.janaSevaHeaders(), ...options.headers },
    });
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

  getPkBirthdayCountdown() {
    return this.request<PkBirthdayCountdownPayload>("/pk-birthday/countdown");
  }

  sendJanaSevaOtp(email: string) {
    return this.request<{ sent: boolean; devCode?: string; message: string }>("/charity/otp/send", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  verifyJanaSevaOtp(email: string, code: string) {
    return this.request<{ sessionToken: string; email: string; expiresAt: string }>(
      "/charity/otp/verify",
      { method: "POST", body: JSON.stringify({ email, code }) },
    );
  }

  getCharityStats() {
    return this.request<CharityStats>("/charity/stats");
  }

  getBloodRequests(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<{ requests: BloodRequest[]; total: number; page: number }>(
      `/charity/blood-requests${qs}`,
    );
  }

  getBloodRequest(slug: string, reveal?: boolean) {
    const qs = reveal ? "?reveal=true" : "";
    return this.request<BloodRequest>(`/charity/blood-requests/${slug}${qs}`);
  }

  createBloodRequest(body: Record<string, unknown>) {
    return this.charityRequest<BloodRequest>("/charity/blood-requests", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  createEmergencyPost(body: Record<string, unknown>) {
    return this.charityRequest<EmergencyPost>("/charity/emergency", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  registerJanaSevaVolunteer(body: Record<string, unknown>) {
    return this.charityRequest<CharityVolunteer>("/charity/volunteers/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  fulfillBloodRequest(id: string) {
    return this.request<BloodRequest>(`/charity/blood-requests/${id}/fulfill`, { method: "PATCH" });
  }

  getBloodCamps(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<{ camps: BloodCamp[]; total: number }>(`/charity/blood-camps${qs}`);
  }

  createBloodCamp(body: Record<string, unknown>) {
    return this.charityRequest<BloodCamp>("/charity/blood-camps", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  getWorkshops(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<{ workshops: Workshop[]; total: number }>(`/charity/workshops${qs}`);
  }

  createWorkshop(body: Record<string, unknown>) {
    return this.charityRequest<Workshop>("/charity/workshops", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  getScholarships(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<{ scholarships: Scholarship[]; total: number }>(`/charity/scholarships${qs}`);
  }

  createScholarship(body: Record<string, unknown>) {
    return this.charityRequest<Scholarship>("/charity/scholarships", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  getVolunteers(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<{ volunteers: CharityVolunteer[]; total: number }>(`/charity/volunteers${qs}`);
  }

  getEmergencyPosts(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<{ posts: EmergencyPost[]; total: number }>(`/charity/emergency${qs}`);
  }

  reportCharityAbuse(body: { reason: string; details?: string; bloodRequestId?: string; emergencyPostId?: string }) {
    return this.request<{ id: string }>("/charity/reports", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  getSuccessStories(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<{ stories: JanaSevaSuccessStory[]; total: number; page: number }>(
      `/charity/success-stories${qs}`,
    );
  }

  getSuccessStory(slug: string) {
    return this.request<JanaSevaSuccessStory>(`/charity/success-stories/${slug}`);
  }

  createSuccessStory(body: Record<string, unknown>) {
    return this.charityRequest<JanaSevaSuccessStory>("/charity/success-stories", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  getVolunteerAlertPrefs() {
    return this.charityRequest<{
      registered: boolean;
      pushAvailable: boolean;
      hasPushSubscription: boolean;
      preferences: VolunteerAlertPrefs | null;
    }>("/charity/alerts/me");
  }

  updateVolunteerAlertPrefs(body: Partial<VolunteerAlertPrefs>) {
    return this.charityRequest<VolunteerAlertPrefs>("/charity/alerts/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  subscribeVolunteerPush(subscription: PushSubscriptionBody) {
    return this.charityRequest<{ subscribed: boolean }>("/charity/alerts/push-subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
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

export interface PkBirthdayCountdownPayload {
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isToday: boolean;
    isBirthdaySeason: boolean;
    birthdayLabel: string;
    turningAge: number;
  };
  share: {
    shareText: string;
    twitterUrl: string;
    whatsappUrl: string;
    facebookUrl: string;
    copyText: string;
  };
  updatedAt: string;
}

export interface CharityStats {
  activeBloodRequests: number;
  bloodCamps: number;
  workshops: number;
  volunteers: number;
  peopleHelped: number;
  activeEmergencies: number;
  successStories?: number;
}

export interface SocialShareLinks {
  shareText: string;
  storyUrl?: string;
  twitterUrl: string;
  whatsappUrl: string;
  facebookUrl: string;
  copyText: string;
}

export interface JanaSevaSuccessStory {
  id: string;
  slug: string;
  volunteerName: string;
  sevaType: string;
  sevaTypeLabel: string;
  caption: string;
  helpedSummary?: string;
  helpedDisplay: string;
  photoUrls: string[];
  hashtags: string[];
  city?: string | null;
  state?: string | null;
  viewCount: number;
  createdAt: string;
  share: SocialShareLinks;
}

export interface BloodRequest {
  id: string;
  slug: string;
  patientName?: string | null;
  patientAge?: number | null;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  state: string;
  bloodGroup: string;
  unitsRequired: number;
  urgency: "NORMAL" | "URGENT" | "CRITICAL";
  phone: string;
  alternatePhone?: string | null;
  whatsapp?: string | null;
  expiresAt: string;
  verificationStatus: string;
  status: string;
  anonymous?: boolean;
  viewCount?: number;
  createdAt?: string;
}

export interface BloodCamp {
  id: string;
  slug: string;
  title: string;
  organizerName: string;
  city: string;
  state: string;
  campDate: string;
  campTime: string;
  phone: string;
  description: string;
  verificationStatus: string;
}

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  speaker: string;
  category: string;
  mode: string;
  city?: string | null;
  workshopDate: string;
  isFree: boolean;
  trending?: boolean;
  verificationStatus: string;
}

export interface Scholarship {
  id: string;
  slug: string;
  title: string;
  provider: string;
  amount?: string | null;
  deadline: string;
  category: string;
  applicationUrl: string;
  verificationStatus: string;
}

export interface VolunteerAlertPrefs {
  id: string;
  email: string;
  city?: string | null;
  state?: string | null;
  emailAlertsEnabled: boolean;
  pushAlertsEnabled: boolean;
  notifyBlood: boolean;
  notifyEmergency: boolean;
  notifyCamps: boolean;
  notifyEducation: boolean;
  pushEndpoint?: string | null;
}

export interface CharityVolunteer {
  id: string;
  displayName: string;
  city: string;
  state: string;
  skills: string[];
  tier: string;
  contributionScore: number;
  isBloodDonor: boolean;
  phone?: string | null;
  contactEmail?: string | null;
}

export interface EmergencyPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  city: string;
  phone: string;
  verificationStatus: string;
}

export const api = new ApiClient(API_URL);
