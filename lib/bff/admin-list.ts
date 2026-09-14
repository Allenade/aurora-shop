/** Client-safe admin list hydration types + fetch keys (no next/headers). */

export type AdminListInitialData<T> = {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
  error: string | null;
};

/** Default fetch key: empty query, default filter, page 1, reload 0 */
const SEP = "\u0000";
export const ADMIN_ORDERS_INITIAL_KEY = ["", "All Orders", "1", "0"].join(SEP);
export const ADMIN_INVENTORY_INITIAL_KEY = ["", "All Status", "1", "0"].join(SEP);
export const ADMIN_PRODUCTS_INITIAL_KEY = ["", "All Products", "1", "0"].join(SEP);
