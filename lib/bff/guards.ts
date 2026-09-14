import { redirect } from "next/navigation";
import { getCurrentUser, AuthError } from "@/lib/bff/auth";
import type { SessionUser } from "@/lib/permissions/permissions.types";

export async function requireAdminUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");
  if (user.type !== "admin") redirect("/dashboard");
  return user;
}

export async function requireBuyerUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");
  if (user.type === "admin") redirect("/admin/overview");
  return user;
}

export async function requireAuthenticatedUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Unauthorized", 401);
  }
  return user;
}
