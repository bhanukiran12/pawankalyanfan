import jwt, { type SignOptions } from "jsonwebtoken";
import type { JwtPayload } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "dev-jwt-secret-change-me";
const JWT_EXPIRES: SignOptions["expiresIn"] = "7d";

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
