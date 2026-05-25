import crypto from "crypto";
import { prisma } from "@pkf/database";

const OTP_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const SECRET = process.env.JANA_SEVA_OTP_SECRET || process.env.JWT_SECRET || "jana-seva-otp-dev";

function hashCode(code: string): string {
  return crypto.createHash("sha256").update(`${SECRET}:${code}`).digest("hex");
}

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createEmailOtp(email: string): Promise<{ code: string; expiresAt: Date }> {
  const normalized = email.trim().toLowerCase();
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.janaSevaEmailOtp.deleteMany({ where: { email: normalized } });
  await prisma.janaSevaEmailOtp.create({
    data: { email: normalized, codeHash: hashCode(code), expiresAt },
  });

  return { code, expiresAt };
}

export async function verifyEmailOtp(
  email: string,
  code: string,
): Promise<{ sessionToken: string; expiresAt: Date } | null> {
  const normalized = email.trim().toLowerCase();
  const row = await prisma.janaSevaEmailOtp.findFirst({
    where: { email: normalized },
    orderBy: { createdAt: "desc" },
  });
  if (!row || row.expiresAt < new Date()) return null;
  if (row.codeHash !== hashCode(code.trim())) return null;

  await prisma.janaSevaEmailOtp.deleteMany({ where: { email: normalized } });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.janaSevaPostSession.upsert({
    where: { email: normalized },
    update: { token, expiresAt },
    create: { email: normalized, token, expiresAt },
  });

  return { sessionToken: token, expiresAt };
}

export async function getVerifiedEmail(sessionToken: string | undefined): Promise<string | null> {
  if (!sessionToken) return null;
  const row = await prisma.janaSevaPostSession.findUnique({ where: { token: sessionToken } });
  if (!row || row.expiresAt < new Date()) return null;
  return row.email;
}
