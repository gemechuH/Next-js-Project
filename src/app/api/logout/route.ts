import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // ✅ Properly delete the token cookie
    res.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/", // must match the original cookie path
    });

    return res; // ✅ this line is required
  } catch (error: any) {
    return NextResponse.json(
      { error: "Logout failed, try again later" },
      { status: 500 }
    );
  }
}
