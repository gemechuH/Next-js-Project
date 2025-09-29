import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/dbconfig";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    // Create JWT
    // const token = jwt.sign(
    //   { id: user._id, email: user.email },
    //   process.env.JWT_SECRET!,
    //   { expiresIn: "1d" }
    // );

    return NextResponse.json({
      message: "Login successful",
    //   token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
