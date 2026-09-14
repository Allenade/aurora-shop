import type { SessionUser, UserType } from "@/lib/permissions/permissions.types";

/** Cookie name — opaque to browser JS (httpOnly). */
export const SESSION_COOKIE = "aurora_session";

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.includes("change-me")) {
      throw new Error("SESSION_SECRET must be a strong secret in production");
    }
    return secret;
  }
  return secret || "aurora-dev-session-secret-change-me";
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
  accessToken?: string;
  refreshToken?: string;
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
  accessToken?: string;
  refreshToken?: string;
};
