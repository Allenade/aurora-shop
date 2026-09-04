import type { SessionUser, UserType } from "@/lib/permissions/permissions.types";

/** Cookie name — opaque to browser JS (httpOnly). */
export const SESSION_COOKIE = "aurora_session";

export type AuthMode = "mock" | "upstream";

export function getAuthMode(): AuthMode {
  const mode = process.env.AUTH_MODE?.trim().toLowerCase();
  return mode === "upstream" ? "upstream" : "mock";
}

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required in production");
  }
  return "aurora-dev-session-secret-change-me";
}

export function getBackendUrl(): string | null {
  const url = process.env.BACKEND_URL?.trim();
  return url ? url.replace(/\/$/, "") : null;
}

export type SessionPayload = {
  sub: string;
  email: string;
  typ: UserType;
  exp: number;
};

export type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResult = {
  user: SessionUser;
  /** Where the UI should send the user after login. */
  redirectTo: string;
};
