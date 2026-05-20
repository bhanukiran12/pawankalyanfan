import type { Request, Response, NextFunction } from "express";
import { verifyToken, extractBearerToken } from "./jwt";
import type { JwtPayload } from "./types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function success<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ success: true, data });
}

export function error(res: Response, message: string, status = 400): void {
  res.status(status).json({ success: false, error: message });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) return error(res, "Unauthorized", 401);

  const payload = verifyToken(token);
  if (!payload) return error(res, "Invalid token", 401);

  req.user = payload;
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractBearerToken(req.headers.authorization);
  if (token) {
    const payload = verifyToken(token);
    if (payload) req.user = payload;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return error(res, "Unauthorized", 401);
  if (req.user.role !== "ADMIN" && req.user.role !== "MODERATOR") {
    return error(res, "Forbidden", 403);
  }
  next();
}

export function asyncHandler(
  fn: (
    req: import("express").Request,
    res: import("express").Response,
    next: import("express").NextFunction,
  ) => void | Promise<void>,
) {
  return (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
