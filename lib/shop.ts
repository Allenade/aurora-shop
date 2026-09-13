export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type ProductSpec = {
  label: string;
  value: string;
};

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  brand: string;
  subcategory: string;
  price: number;
  priceLabel: string;
  unitLabel: string;
  badge?: "In Stock" | "New" | "Low Stock" | "Out of Stock";
  stockStatus: StockStatus;
  stockCount: number;
  image: string;
  images: string[];
  isNew?: boolean;
  sku?: string;
  minStock?: number;
  highlights: {
    label: string;
    icon: "verified" | "support" | "returns" | "shipping";
  }[];
  specs: ProductSpec[];
  datasheetNote: string;
  reviewsNote: string;
};

export const SHOP_STOCK_OPTIONS = [
  { value: "in_stock" as const, label: "In Stock" },
  { value: "low_stock" as const, label: "Low Stock" },
  { value: "out_of_stock" as const, label: "Out of Stock" },
];

export const SHOP_PRICE_MIN = 0;
export const SHOP_PRICE_MAX = 75000;

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}
