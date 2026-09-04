import {
  clearSessionCookie,
  readSessionCookie,
  sealSession,
  sessionMaxAge,
  writeSessionCookie,
} from "@/lib/bff/session-cookie";
import {
  AuthError,
  sessionFieldsFromUser,
  upstreamCurrentUser,
  upstreamLoginUser,
} from "@/lib/bff/upstream";
import type { LoginInput } from "@/lib/bff/config";
import type { SessionUser } from "@/lib/permissions/permissions.types";

export async function loginWithPassword(input: LoginInput) {
  const result = await upstreamLoginUser(input);
  const maxAge = sessionMaxAge(input.rememberMe);
  const token = sealSession(sessionFieldsFromUser(result.user), maxAge);
  await writeSessionCookie(token, maxAge);
  return result;
}

export async function logoutSession() {
  await clearSessionCookie();
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await readSessionCookie();
  if (!session) return null;
  try {
    return await upstreamCurrentUser(session);
  } catch (error) {
    if (error instanceof AuthError && error.status === 401) {
      await clearSessionCookie();
      return null;
    }
    throw error;
  }
}

export async function requireCurrentUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Unauthorized", 401);
  }
  return user;
}

export { AuthError };
