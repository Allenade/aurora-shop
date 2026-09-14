"use client";

import { useEffect } from "react";
import { BffRequestError, meRequest } from "@/lib/bff/client";
import { handleSessionExpired } from "@/lib/session-expiry";

/**
 * Watches sealed-session expiry for admin + buyer shells.
 * Schedules logout+toast at `expiresAt`, and reacts if /me is already 401.
 */
export function SessionExpiryWatcher() {
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    void meRequest()
      .then((data) => {
        if (cancelled) return;
        const expiresAt = data.expiresAt;
        if (typeof expiresAt !== "number" || !Number.isFinite(expiresAt)) {
          return;
        }
        const ms = expiresAt * 1000 - Date.now();
        if (ms <= 0) {
          handleSessionExpired();
          return;
        }
        timer = setTimeout(() => {
          handleSessionExpired();
        }, ms);
      })
      .catch((error) => {
        if (cancelled) return;
        if (error instanceof BffRequestError && error.status === 401) {
          // bffFetch also triggers handleSessionExpired; once-guard covers both.
        }
      });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}
