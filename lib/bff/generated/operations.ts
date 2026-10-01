/**
 * Operation IDs from Aurora Shop OpenAPI (`/docs/swagger/json`).
 * Regenerated conceptually by `chowbea-axios extract` + Swagger operationId.
 */
export const operations = {
  loginUser: { method: "POST", path: "/auth/login" },
  registerUser: { method: "POST", path: "/auth/register" },
  verifySignupOtp: { method: "POST", path: "/auth/otp/verify" },
  resendSignupOtp: { method: "POST", path: "/auth/otp/resend" },
  refreshSession: { method: "POST", path: "/auth/refresh" },
  getAuthMe: { method: "GET", path: "/auth/me" },
  logoutUser: { method: "POST", path: "/auth/logout" },
  changePassword: { method: "POST", path: "/auth/password" },
  getBuyerDashboard: { method: "GET", path: "/dashboard" },
  getHealth: { method: "GET", path: "/health" },
  listProducts: { method: "GET", path: "/products" },
  getProductBySlug: { method: "GET", path: "/products/:slug" },
  createProduct: { method: "POST", path: "/admin/products" },
  updateProduct: { method: "PATCH", path: "/admin/products/:id" },
  deleteProduct: { method: "DELETE", path: "/admin/products/:id" },
  listInventory: { method: "GET", path: "/inventory" },
  restockInventory: { method: "POST", path: "/inventory/:productId/restock" },
  createCheckout: { method: "POST", path: "/checkout" },
  getCart: { method: "GET", path: "/cart" },
  setCartItem: { method: "POST", path: "/cart/items" },
  removeCartItem: { method: "DELETE", path: "/cart/items/:slug" },
  clearCart: { method: "DELETE", path: "/cart" },
  listOrders: { method: "GET", path: "/orders" },
  getOrderCounts: { method: "GET", path: "/orders/counts" },
  getOrder: { method: "GET", path: "/orders/:id" },
  trackOrder: { method: "GET", path: "/track" },
  setOrderStatus: { method: "PATCH", path: "/admin/orders/:id/status" },
  /** Paystack webhook only. `provider=bank` is gone (410). */
  handlePaymentCallback: { method: "POST", path: "/transactions/callback/:provider" },
  /** Re-verifies a pending shop payment with Paystack, including transfers. */
  getTransactionStatus: { method: "GET", path: "/transactions/:reference/status" },
  /**
   * Swagger operationId is still `confirmBankTransfer`.
   * It re-verifies the reference, amount, and currency with Paystack
   * (`confirmationSource: admin`) and does not mark a transfer paid by itself.
   */
  confirmBankTransfer: { method: "POST", path: "/transactions/:reference/confirm" },
  createQuote: { method: "POST", path: "/quotes" },
  updateQuote: { method: "PATCH", path: "/quotes/:id" },
  listQuotes: { method: "GET", path: "/quotes" },
  setQuoteStatus: { method: "PATCH", path: "/admin/quotes/:id/status" },
  getAdminOverview: { method: "GET", path: "/admin/overview" },
  listUsers: { method: "GET", path: "/users" },
  setUserStatus: { method: "PATCH", path: "/users/:id/status" },
  getProfileSettings: { method: "GET", path: "/settings/profile" },
  updateProfileSettings: { method: "PATCH", path: "/settings/profile" },
  getProfileAvatarUploadUrl: {
    method: "POST",
    path: "/settings/profile/avatar/upload-url",
  },
  updateProfileAvatar: { method: "PATCH", path: "/settings/profile/avatar" },
  deleteProfileAvatar: { method: "DELETE", path: "/settings/profile/avatar" },
  updateSettingsPassword: { method: "PATCH", path: "/settings/password" },
  getNotificationSettings: { method: "GET", path: "/settings/notifications" },
  updateNotificationSettings: { method: "PATCH", path: "/settings/notifications" },
  getShippingSettings: { method: "GET", path: "/settings/shipping" },
  updateShippingSettings: { method: "PATCH", path: "/settings/shipping" },
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
