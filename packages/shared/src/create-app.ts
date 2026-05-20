import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { success } from "./service";

const rateMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(limit = 100, windowMs = 60_000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = rateMap.get(ip);

    if (!entry || now > entry.resetAt) {
      rateMap.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      return res.status(429).json({ success: false, error: "Too many requests" });
    }
    entry.count++;
    next();
  };
}

export function createServiceApp(name: string) {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(rateLimit());

  app.get("/health", (_req: Request, res: Response) => {
    success(res, { service: name, status: "ok", timestamp: new Date().toISOString() });
  });

  return app;
}
