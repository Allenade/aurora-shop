import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  getSessionSecret,
  SESSION_COOKIE,
  type SessionPayload,
} from "@/lib/bff/config";

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function sealSession(
  data: Omit<SessionPayload, "exp"> & { exp?: number },
  maxAgeSec: number,
): string {
  const payload: SessionPayload = {
    ...data,
    exp: data.exp ?? Math.floor(Date.now() / 1000) + maxAgeSec,
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const sig = sign(body, getSessionSecret());
  return `${body}.${sig}`;
}

export function unsealSession(token: string): SessionPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = sign(body, getSessionSecret());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (!parsed.sub || !parsed.email || !parsed.typ || !parsed.exp) return null;
    if (parsed.exp * 1000 < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function readSessionCookie(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  return unsealSession(raw);
}

export async function writeSessionCookie(
  token: string,
  maxAgeSec: number,
): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSec,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function sessionMaxAge(rememberMe?: boolean) {
  return rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
}
