import {
  MOCK_ADMIN_SESSION_USER,
  MOCK_SESSION_USER,
} from "@/lib/session";
import type { SessionUser, UserType } from "@/lib/permissions/permissions.types";
import type { LoginInput, LoginResult, SessionPayload } from "@/lib/bff/config";
import { getAuthMode, getBackendUrl } from "@/lib/bff/config";
import { AuthError, nestFetch } from "@/lib/bff/nest";

function withEmail(user: SessionUser, email: string): SessionUser {
  const [local] = email.split("@");
  const parts = (local ?? "User").split(/[._-]/).filter(Boolean);
  const firstName =
    parts[0] ?
      parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
    : user.firstName;
  const lastName =
    parts[1] ?
      parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
    : user.lastName;

  return {
    ...user,
    email,
    firstName,
    lastName,
  };
}

function resolveMockUserType(email: string): UserType {
  const normalized = email.trim().toLowerCase();
  if (
    normalized.includes("admin") ||
    normalized.endsWith("@regaliaelectrical.ng")
  ) {
    return "admin";
  }
  return "procurement";
}

function mockUserForType(type: UserType, email: string): SessionUser {
  if (type === "admin") {
    return withEmail(MOCK_ADMIN_SESSION_USER, email);
  }
  return withEmail(MOCK_SESSION_USER, email);
}

function redirectForType(type: UserType) {
  return type === "admin" ? "/admin/overview" : "/dashboard";
}

async function mockLogin(input: LoginInput): Promise<LoginResult> {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password) {
    throw new AuthError("Email and password are required", 400);
  }
  if (input.password.length < 4) {
    throw new AuthError("Invalid email or password", 401);
  }

  const typ = resolveMockUserType(email);
  const user = mockUserForType(typ, email);
  return { user, redirectTo: redirectForType(typ) };
}

async function mockMe(session: SessionPayload): Promise<SessionUser | null> {
  return mockUserForType(session.typ, session.email);
}

type NestAuthResponse = LoginResult & {
  accessToken?: string;
  refreshToken?: string;
};

async function upstreamLogin(input: LoginInput): Promise<LoginResult> {
  if (!getBackendUrl()) {
    throw new AuthError("BACKEND_URL is not configured", 503);
  }
  return nestFetch<NestAuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
    session: null,
  });
}

async function upstreamMe(session: SessionPayload): Promise<SessionUser | null> {
  if (!getBackendUrl()) {
    throw new AuthError("BACKEND_URL is not configured", 503);
  }
  if (!session.accessToken && !session.refreshToken) {
    throw new AuthError("Unauthorized", 401);
  }
  return nestFetch<SessionUser>("/auth/me", { session });
}

export { AuthError };

export async function upstreamLoginUser(
  input: LoginInput,
): Promise<LoginResult> {
  if (getAuthMode() === "upstream") return upstreamLogin(input);
  return mockLogin(input);
}

export async function upstreamCurrentUser(
  session: SessionPayload,
): Promise<SessionUser | null> {
  if (getAuthMode() === "upstream") return upstreamMe(session);
  return mockMe(session);
}

export async function upstreamRegister(input: Record<string, unknown>) {
  return nestFetch<{ ok: true; email: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
    session: null,
  });
}

export async function upstreamVerifyOtp(email: string, code: string) {
  return nestFetch<NestAuthResponse>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ email, code }),
    session: null,
  });
}

export async function upstreamResendOtp(email: string) {
  return nestFetch<{ ok: true; email: string }>("/auth/otp/resend", {
    method: "POST",
    body: JSON.stringify({ email }),
    session: null,
  });
}

export async function upstreamLogout(session: SessionPayload | null) {
  if (!session?.accessToken || getAuthMode() !== "upstream") return { ok: true };
  try {
    return await nestFetch<{ ok: true }>("/auth/logout", {
      method: "POST",
      session,
    });
  } catch {
    return { ok: true };
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
