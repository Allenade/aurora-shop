import { NextResponse } from "next/server";
import { loginWithPassword } from "@/lib/bff/auth";
import { AuthError, sessionFieldsFromUser, upstreamVerifyOtp } from "@/lib/bff/upstream";
import { getAuthMode } from "@/lib/bff/config";
import {
  sealSession,
  sessionMaxAge,
  writeSessionCookie,
} from "@/lib/bff/session-cookie";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; code?: string };
    if (!body.email || !body.code) {
      return NextResponse.json({ message: "Email and code are required" }, { status: 400 });
    }

    if (getAuthMode() !== "upstream") {
      const result = await loginWithPassword({
        email: body.email,
        password: "mock-verified",
      });
      return NextResponse.json({ user: result.user, redirectTo: result.redirectTo });
    }

    const result = await upstreamVerifyOtp(body.email, body.code);
    const maxAge = sessionMaxAge();
    const token = sealSession(
      sessionFieldsFromUser(result.user, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }),
      maxAge,
    );
    await writeSessionCookie(token, maxAge);
    return NextResponse.json({ user: result.user, redirectTo: result.redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Unable to verify" }, { status: 500 });
  }
}
