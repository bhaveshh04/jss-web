import nodemailer from "nodemailer";
import type Transport from "nodemailer/lib/mailer";

let cachedTransport: Transport | null = null;

function getTransport() {
  if (cachedTransport) return cachedTransport;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) return null;
  cachedTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
  return cachedTransport;
}

/**
 * Best-effort email notification. If SMTP env vars aren't configured, this
 * silently no-ops so the contact form / applications still save to the DB
 * and return success — email is a nice-to-have on top, not a hard dependency.
 */
export async function sendNotificationEmail(opts: { subject: string; text: string; html?: string }) {
  const transport = getTransport();
  const to = process.env.CONTACT_NOTIFY_TO;
  if (!transport || !to) return { sent: false as const };

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    return { sent: true as const };
  } catch (err) {
    console.error("Email notification failed:", err);
    return { sent: false as const };
  }
}
