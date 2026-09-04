import { NextResponse } from "next/server";
import { AuthError, loginWithPassword } from "@/lib/bff/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      rememberMe?: boolean;
    };

    const fieldErrors: Record<string, string> = {};
    if (!body.email?.trim()) fieldErrors.email = "Email is required";
    if (!body.password) fieldErrors.password = "Password is required";
    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { message: "Validation failed", fieldErrors },
        { status: 400 },
      );
    }

    const result = await loginWithPassword({
      email: body.email!,
      password: body.password!,
      rememberMe: Boolean(body.rememberMe),
    });

    return NextResponse.json({
      user: result.user,
      redirectTo: result.redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { message: "Unable to sign in" },
      { status: 500 },
    );
  }
}
