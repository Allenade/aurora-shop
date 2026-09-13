import {
  getBackendUrl,
  type SessionPayload,
} from "@/lib/bff/config";
import { AuthError, nestFetch } from "@/lib/bff/nest";
import {
  operationPath,
  operations,
  type OperationId,
} from "@/lib/bff/generated/operations";

/**
 * Server-only BFF call (RSC / route handlers).
 * Goes Nest directly with the sealed session — browser never sees JWTs.
 */
export async function serverBffCall<T>(
  id: OperationId,
  init?: {
    params?: Record<string, string>;
    query?: Record<string, string | undefined>;
    body?: unknown;
    session?: SessionPayload | null;
  },
): Promise<T> {
  if (!getBackendUrl()) {
    throw new AuthError("BACKEND_URL is not configured", 503);
  }

  const path = operationPath(id, init?.params, init?.query);
  const method = operations[id].method;
  const headers: HeadersInit = {};
  let body: string | undefined;

  if (method !== "GET" && init?.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.body);
  }

  return nestFetch<T>(path, {
    method,
    headers,
    body,
    session: init?.session,
  });
}
