import {
  MOCK_ADMIN_SESSION_USER,
  MOCK_SESSION_USER,
} from "@/lib/session";
import type { SessionUser, UserType } from "@/lib/permissions/permissions.types";
import type { LoginInput, LoginResult, SessionPayload } from "@/lib/bff/config";
import { getAuthMode, getBackendUrl } from "@/lib/bff/config";

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

async function upstreamLogin(input: LoginInput): Promise<LoginResult> {
  void input;
  const base = getBackendUrl();
  if (!base) {
    throw new AuthError("BACKEND_URL is not configured", 503);
  }
  // Wire to real auth when backend is ready:
  // const res = await fetch(`${base}/auth/login`, { ... });
  // Store upstream tokens only in httpOnly cookie / server session — never return JWT to the client.
  throw new AuthError("Upstream auth is not connected yet", 501);
}

async function upstreamMe(session: SessionPayload): Promise<SessionUser | null> {
  void session;
  const base = getBackendUrl();
  if (!base) {
    throw new AuthError("BACKEND_URL is not configured", 503);
  }
  throw new AuthError("Upstream auth is not connected yet", 501);
}

export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/** Auth upstream: mock today, real backend when AUTH_MODE=upstream. */
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

export function sessionFieldsFromUser(user: SessionUser) {
  return {
    sub: user.id,
    email: user.email,
    typ: user.type,
  };
}
