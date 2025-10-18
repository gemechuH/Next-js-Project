// src/app/api/auth/request-reset/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbconfig";
import User from "@/models/User";
import { generateResetToken } from "@/lib/token";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Find user (if exists)
    const user = await User.findOne({ email });

    // Always respond the same to prevent email enumeration
    if (!user) {
      // still return 200 with generic message
      return NextResponse.json({
        message: "If that email exists, we sent reset instructions",
      }, { status: 200 });
    }

    // Generate token and expiry
    const { rawToken, hashedToken } = generateResetToken();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save to user
    user.forgetPasswordToken = hashedToken;
    user.forgetPasswordTokenExpiry = expiry;
    await user.save();

    // Build reset URL
    const base = process.env.BASE_URL || "http://localhost:3000";
    const resetUrl = `${base}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

    // Compose email (simple template)
    const html = `
      <p>Hi ${user.username},</p>
      <p>You requested a password reset. Click the link below to reset your password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>If you didn't request this, ignore this email.</p>
    `;

    await sendEmail(user.email, "Your password reset link", html);

    return NextResponse.json({
      message: "If that email exists, we sent reset instructions",
    }, { status: 200 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
