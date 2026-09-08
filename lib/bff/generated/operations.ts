/**
 * Operation IDs from Aurora Shop OpenAPI (`/docs/swagger/json`).
 * Regenerated conceptually by `chowbea-axios extract` + Swagger operationId.
 */
export const operations = {
  loginUser: { method: "POST", path: "/auth/login" },
  registerUser: { method: "POST", path: "/auth/register" },
  verifySignupOtp: { method: "POST", path: "/auth/otp/verify" },
  refreshSession: { method: "POST", path: "/auth/refresh" },
  getAuthMe: { method: "GET", path: "/auth/me" },
  logoutUser: { method: "POST", path: "/auth/logout" },
  changePassword: { method: "POST", path: "/auth/password" },
  getHealth: { method: "GET", path: "/health" },
  listProducts: { method: "GET", path: "/products" },
  getProductBySlug: { method: "GET", path: "/products/:slug" },
  createProduct: { method: "POST", path: "/admin/products" },
  updateProduct: { method: "PATCH", path: "/admin/products/:id" },
  deleteProduct: { method: "DELETE", path: "/admin/products/:id" },
  listInventory: { method: "GET", path: "/inventory" },
  restockInventory: { method: "POST", path: "/inventory/:productId/restock" },
  createCheckout: { method: "POST", path: "/checkout" },
  listOrders: { method: "GET", path: "/orders" },
  getOrder: { method: "GET", path: "/orders/:id" },
  trackOrder: { method: "GET", path: "/track" },
  setOrderStatus: { method: "PATCH", path: "/admin/orders/:id/status" },
  handlePaymentCallback: { method: "POST", path: "/transactions/callback/:provider" },
  confirmBankTransfer: { method: "POST", path: "/transactions/:reference/confirm" },
  createQuote: { method: "POST", path: "/quotes" },
  listQuotes: { method: "GET", path: "/quotes" },
  setQuoteStatus: { method: "PATCH", path: "/admin/quotes/:id/status" },
  getAdminOverview: { method: "GET", path: "/admin/overview" },
  listUsers: { method: "GET", path: "/users" },
  setUserStatus: { method: "PATCH", path: "/users/:id/status" },
  getProfileSettings: { method: "GET", path: "/settings/profile" },
  updateProfileSettings: { method: "PATCH", path: "/settings/profile" },
  updateSettingsPassword: { method: "PATCH", path: "/settings/password" },
  getNotificationSettings: { method: "GET", path: "/settings/notifications" },
  updateNotificationSettings: { method: "PATCH", path: "/settings/notifications" },
  getBillingSettings: { method: "GET", path: "/settings/billing" },
  getStorageUploadUrl: { method: "POST", path: "/storage/upload-url" },
  uploadStorageFile: { method: "POST", path: "/storage/upload" },
} as const;

export type OperationId = keyof typeof operations;

export function operationPath(
  id: OperationId,
  params?: Record<string, string>,
  query?: Record<string, string | undefined>,
) {
  let path: string = operations[id].path;
  for (const [key, value] of Object.entries(params ?? {})) {
    path = path.replace(`:${key}`, encodeURIComponent(value));
  }
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}
