import { apiGet, apiSend } from "@/lib/bff/client";
import {
  operationPath,
  operations,
  type OperationId,
} from "@/lib/bff/generated/operations";

/** Browser BFF client keyed by OpenAPI operationId — never talks to Nest directly. */
export function bffCall<T>(
  id: OperationId,
  init?: {
    params?: Record<string, string>;
    query?: Record<string, string | undefined>;
    body?: unknown;
  },
) {
  const path = operationPath(id, init?.params, init?.query);
  const method = operations[id].method;
  if (method === "GET") return apiGet<T>(path);
  return apiSend<T>(path, method, init?.body);
}
