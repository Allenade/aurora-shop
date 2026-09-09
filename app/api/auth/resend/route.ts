import { NextResponse } from "next/server";
import { AuthError, upstreamResendOtp } from "@/lib/bff/upstream";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    if (!body.email?.trim()) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }
    const result = await upstreamResendOtp(body.email.trim());
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Unable to resend code" }, { status: 500 });
  }
}
