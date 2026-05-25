/**
 * Sends Jana Seva OTP emails via Resend (preferred) or SMTP.
 * Set RESEND_API_KEY or SMTP_* in .env — never commit real keys.
 */

export async function sendJanaSevaOtpEmail(to: string, code: string): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    const ok = await sendViaResend(resendKey, to, code);
    if (ok) return true;
  }

  const smtpHost = process.env.SMTP_HOST?.trim();
  if (smtpHost) {
    return sendViaSmtp(to, code);
  }

  return false;
}

async function sendViaResend(apiKey: string, to: string, code: string): Promise<boolean> {
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    "Jana Seva <onboarding@resend.dev>";

  const siteName = process.env.SITE_NAME || "PawanKalyanFan Jana Seva";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `${siteName} — your verification code`,
        html: otpHtml(code, siteName),
        text: `Your Jana Seva verification code is ${code}. It expires in 10 minutes. Do not share this code.`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Jana Seva OTP] Resend error:", res.status, err);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[Jana Seva OTP] Resend failed:", e);
    return false;
  }
}

async function sendViaSmtp(to: string, code: string): Promise<boolean> {
  const host = process.env.SMTP_HOST!.trim();
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER?.trim() || process.env.SMTP_FROM?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  const from = process.env.SMTP_FROM?.trim() || user;

  if (!user || !pass || !from) {
    console.error("[Jana Seva OTP] SMTP_USER, SMTP_PASSWORD, and SMTP_FROM required");
    return false;
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

    const siteName = process.env.SITE_NAME || "PawanKalyanFan Jana Seva";
    await transporter.sendMail({
      from,
      to,
      subject: `${siteName} — your verification code`,
      text: `Your verification code is ${code}. It expires in 10 minutes.`,
      html: otpHtml(code, siteName),
    });
    return true;
  } catch (e) {
    console.error("[Jana Seva OTP] SMTP failed:", e);
    return false;
  }
}

function otpHtml(code: string, siteName: string): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#c41e3a;">${siteName}</h2>
      <p>Your one-time verification code to post or register on Jana Seva:</p>
      <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#111;">${code}</p>
      <p style="color:#666;font-size:14px;">Valid for 10 minutes. If you did not request this, ignore this email.</p>
    </div>
  `;
}
