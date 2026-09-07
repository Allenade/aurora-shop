import { NextResponse } from "next/server";
import { AuthError, upstreamRegister } from "@/lib/bff/upstream";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const result = await upstreamRegister(body);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Unable to register" }, { status: 500 });
  }
}
