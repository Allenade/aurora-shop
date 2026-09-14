import type { SessionUser } from "@/lib/permissions/permissions.types";
import type { LoginInput, LoginResult, SessionPayload } from "@/lib/bff/config";
import { getBackendUrl } from "@/lib/bff/config";
import { AuthError, nestFetch } from "@/lib/bff/nest";

type NestAuthResponse = LoginResult & {
  accessToken?: string;
  refreshToken?: string;
};

function requireBackendUrl() {
  if (!getBackendUrl()) {
    throw new AuthError("BACKEND_URL is not configured", 503);
  }
}

export { AuthError };

export async function upstreamLoginUser(
  input: LoginInput,
): Promise<LoginResult> {
  requireBackendUrl();
  return nestFetch<NestAuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
    session: null,
  });
}

export async function upstreamCurrentUser(
  session: SessionPayload,
): Promise<SessionUser | null> {
  requireBackendUrl();
  if (!session.accessToken && !session.refreshToken) {
    throw new AuthError("Unauthorized", 401);
  }
  return nestFetch<SessionUser>("/auth/me", { session });
}

export async function upstreamRegister(input: Record<string, unknown>) {
  requireBackendUrl();
  return nestFetch<{ ok: true; email: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
    session: null,
  });
}

export async function upstreamVerifyOtp(email: string, code: string) {
  requireBackendUrl();
  return nestFetch<NestAuthResponse>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ email, code }),
    session: null,
  });
}

export async function upstreamResendOtp(email: string) {
  requireBackendUrl();
  return nestFetch<{ ok: true; email: string }>("/auth/otp/resend", {
    method: "POST",
    body: JSON.stringify({ email }),
    session: null,
  });
}

export async function upstreamLogout(session: SessionPayload | null) {
  if (!session?.accessToken) return { ok: true as const };
  try {
    requireBackendUrl();
    return await nestFetch<{ ok: true }>("/auth/logout", {
      method: "POST",
      session,
    });
  } catch {
    return { ok: true as const };
  }
}

export function sessionFieldsFromUser(
  user: SessionUser,
  tokens?: { accessToken?: string; refreshToken?: string },
) {
  return {
    sub: user.id,
    email: user.email,
    typ: user.type,
    accessToken: tokens?.accessToken,
    refreshToken: tokens?.refreshToken,
  };
}
