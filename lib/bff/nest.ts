import { cookies } from "next/headers";
import {
  getBackendUrl,
  SESSION_COOKIE,
  type SessionPayload,
} from "@/lib/bff/config";
import {
  sealSession,
  sessionMaxAge,
  unsealSession,
  writeSessionCookie,
} from "@/lib/bff/session-cookie";

export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

type NestError = {
  message?: string | string[];
  statusCode?: number;
};

function nestErrorMessage(body: NestError | null, fallback: string) {
  const message = body?.message;
  if (Array.isArray(message)) {
    return message.filter(Boolean).join(", ") || fallback;
  }
  if (typeof message === "string" && message.trim()) return message;
  return fallback;
}

async function parseJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function readSealedSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  return unsealSession(raw);
}

async function persistTokens(
  session: SessionPayload,
  tokens: { accessToken: string; refreshToken: string },
) {
  const maxAge = Math.max(
    session.exp - Math.floor(Date.now() / 1000),
    sessionMaxAge(),
  );
  const token = sealSession(
    {
      sub: session.sub,
      email: session.email,
      typ: session.typ,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
    maxAge,
  );
  await writeSessionCookie(token, maxAge);
}

export async function nestFetch<T>(
  path: string,
  init?: RequestInit & { session?: SessionPayload | null },
): Promise<T> {
  const base = getBackendUrl();
  if (!base) {
    throw new AuthError("BACKEND_URL is not configured", 503);
  }

  let session = init?.session ?? (await readSealedSession());
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const url = `${base}/api/v1${path}`;
  let res = await fetch(url, { ...init, headers });

  if (res.status === 401 && session?.refreshToken) {
    const refreshed = await fetch(`${base}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });
    const tokens = await parseJson<{
      accessToken: string;
      refreshToken: string;
    }>(refreshed);
    if (refreshed.ok && tokens?.accessToken) {
      session = { ...session, ...tokens };
      await persistTokens(session, tokens);
      headers.set("Authorization", `Bearer ${tokens.accessToken}`);
      res = await fetch(url, { ...init, headers });
    }
  }

  const body = await parseJson<T & NestError>(res);
  if (!res.ok) {
    throw new AuthError(
      nestErrorMessage(body, "Request failed"),
      body?.statusCode ?? res.status,
    );
  }
  return body as T;
}
