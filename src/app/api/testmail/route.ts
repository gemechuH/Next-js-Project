import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function GET() {
  try {
    await sendMail(
      "recipient@gmail.com",
      "Test Email",
      "<h1>Hello from Next.js Nodemailer!</h1>"
    );
    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
