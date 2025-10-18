// src/app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/dbconfig";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Hash incoming token (same algorithm used when storing)
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      email,
      forgetPasswordToken: hashed,
      forgetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // Hash new password
    const hashedPwd = await bcrypt.hash(password, 10);
    user.password = hashedPwd;

    // Clear reset token fields
    user.forgetPasswordToken = undefined as any;
    user.forgetPasswordTokenExpiry = undefined as any;

    await user.save();

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
