/**
 * Sends Jana Seva OTP emails via Resend (preferred) or SMTP.
 */
import { sendTransactionalEmail, type OtpEmailResult } from "./send-transactional-email";

export type { OtpEmailResult };

export async function sendJanaSevaOtpEmail(to: string, code: string): Promise<OtpEmailResult> {
  const siteName = process.env.SITE_NAME || "PawanKalyanFan Jana Seva";
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#c41e3a;">${siteName}</h2>
      <p>Your one-time verification code to post or register on Jana Seva:</p>
      <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#111;">${code}</p>
      <p style="color:#666;font-size:14px;">Valid for 10 minutes. If you did not request this, ignore this email.</p>
    </div>
  `;
  const text = `Your Jana Seva verification code is ${code}. It expires in 10 minutes.`;
  const result = await sendTransactionalEmail(to, `${siteName} — your verification code`, html, text);
  if (result.ok) return result;
  return {
    ok: false,
    error:
      result.error +
      " Verify RESEND_FROM_EMAIL domain at resend.com/domains or set SMTP_* in .env.",
  };
}

export function logOtpEmailConfig(): void {
  const hasResend = !!process.env.RESEND_API_KEY?.trim();
  const hasSmtp = !!process.env.SMTP_HOST?.trim();
  if (hasResend) {
    console.log(`[charity-service] Email: Resend configured`);
  } else if (hasSmtp) {
    console.log(`[charity-service] Email: SMTP (${process.env.SMTP_HOST})`);
  } else {
    console.warn("[charity-service] Email: NOT CONFIGURED — set RESEND_API_KEY or SMTP_*");
  }
  const push = !!(
    process.env.VAPID_PUBLIC_KEY &&
    process.env.VAPID_PRIVATE_KEY &&
    process.env.VAPID_SUBJECT
  );
  console.log(`[charity-service] Volunteer browser alerts: ${push ? "VAPID ready" : "VAPID keys missing"}`);
}
