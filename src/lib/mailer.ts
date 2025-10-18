// src/lib/mailer.ts
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM = process.env.EMAIL_FROM || "no-reply@example.com";

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.warn("Mailer not fully configured — set SMTP_HOST/SMTP_USER/SMTP_PASS in .env.local for emails.");
}

export async function sendEmail(to: string, subject: string, html: string, text?: string) {
  if (!SMTP_HOST) {
    console.log("Email not sent (no SMTP configured). Here is the content:");
    console.log({ to, subject, text, html });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    secure: SMTP_PORT === 465, // true for 465
  });

  await transporter.sendMail({
    from: FROM,
    to,
    subject,
    text: text || html.replace(/<\/?[^>]+(>|$)/g, ""),
    html,
  });
}
