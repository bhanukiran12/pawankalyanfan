/** Resend or SMTP — shared by OTP and volunteer alert emails */

export type SendEmailResult = { ok: true } | { ok: false; error: string };

export async function sendTransactionalEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<SendEmailResult> {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    const r = await sendViaResend(resendKey, to, subject, html, text);
    if (r.ok) return r;
  }

  const smtpHost = process.env.SMTP_HOST?.trim();
  if (smtpHost) {
    return sendViaSmtp(to, subject, html, text);
  }

  return { ok: false, error: "Email not configured (RESEND_API_KEY or SMTP_*)" };
}

function fromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    "onboarding@resend.dev"
  );
}

async function sendViaResend(
  apiKey: string,
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<SendEmailResult> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: fromAddress(), to: [to], subject, html, text }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${err.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Resend failed" };
  }
}

async function sendViaSmtp(
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<SendEmailResult> {
  const host = process.env.SMTP_HOST!.trim();
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER?.trim() || process.env.SMTP_FROM?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  const from = process.env.SMTP_FROM?.trim() || user;
  if (!user || !pass || !from) {
    return { ok: false, error: "SMTP credentials missing" };
  }
  try {
    const nodemailer = await import("nodemailer");
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
    await transporter.sendMail({ from, to, subject, text, html });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "SMTP failed" };
  }
}
