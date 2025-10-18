// src/lib/token.ts
import crypto from "crypto";

export function generateResetToken() {
  // Raw token for email link (human-safe base64 or hex)
  const rawToken = crypto.randomBytes(32).toString("hex"); // 64 chars
  // Hashed token stored in DB
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, hashedToken };
}
