"use client";

import { toast } from "sonner";
import { logoutRequest } from "@/lib/bff/client";

const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Please sign in again.";

let handling = false;

/**
 * Toast once, clear the cookie via logout, then send admin/buyer to sign-in.
 * Safe to call from multiple 401s / timers — only runs once per page load.
 */
export function handleSessionExpired(message = SESSION_EXPIRED_MESSAGE) {
  if (typeof window === "undefined") return;
  if (handling) return;
  handling = true;

  toast.error(message);

  void logoutRequest()
    .catch(() => undefined)
    .finally(() => {
      const url = new URL("/auth/signin", window.location.origin);
      url.searchParams.set("reason", "session_expired");
      // Already toasted in-app — sign-in page should not toast again.
      url.searchParams.set("notified", "1");
      window.location.assign(url.toString());
    });
}

export function sessionExpiredMessage() {
  return SESSION_EXPIRED_MESSAGE;
}
