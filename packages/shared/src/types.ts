export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  isPremium: boolean;
  premiumBadge?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isPremium: boolean;
  premiumBadge: boolean;
  image?: string | null;
}

export interface ServiceHealth {
  service: string;
  status: "ok" | "error";
  timestamp: string;
}
