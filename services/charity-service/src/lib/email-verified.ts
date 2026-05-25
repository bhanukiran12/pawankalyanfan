import type { Request, Response, NextFunction } from "express";
import { error, asyncHandler } from "@pkf/shared";
import { getVerifiedEmail } from "./otp";

export const requireJanaSevaEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token =
    (req.headers["x-jana-seva-session"] as string) ||
    (req.body?.janaSevaSession as string);
  const email = await getVerifiedEmail(token);
  if (!email) {
    return error(res, "Verify your email with OTP before posting.", 403);
  }
  req.janaSevaEmail = email;
  next();
});

declare global {
  namespace Express {
    interface Request {
      janaSevaEmail?: string;
    }
  }
}

export const VERIFIED_POST = {
  verificationStatus: "VERIFIED" as const,
  verifiedAt: new Date(),
};
