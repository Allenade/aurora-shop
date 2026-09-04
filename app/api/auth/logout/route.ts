import { NextResponse } from "next/server";
import { logoutSession } from "@/lib/bff/auth";

export async function POST() {
  await logoutSession();
  return NextResponse.json({ ok: true });
}
