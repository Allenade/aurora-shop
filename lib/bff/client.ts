import type { SessionUser } from "@/lib/permissions/permissions.types";

export type ApiErrorBody = {
  message: string;
  fieldErrors?: Record<string, string>;
};

async function parseJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export class BffRequestError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "BffRequestError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Browser → Next BFF. Always same-origin; cookies sent automatically. */
export async function bffFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = await parseJson<T & ApiErrorBody>(res);
  if (!res.ok) {
    throw new BffRequestError(
      body?.message ?? "Request failed",
      res.status,
      body?.fieldErrors,
    );
  }
  return body as T;
}

export type LoginResponse = {
  user: SessionUser;
  redirectTo: string;
};

export function loginRequest(input: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  return bffFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logoutRequest() {
  return bffFetch<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

export function meRequest() {
  return bffFetch<{ user: SessionUser }>("/api/auth/me");
}
