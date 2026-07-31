import { cn } from "@/lib/utils";

export type NavIconName =
  | "dashboard"
  | "overview"
  | "shop"
  | "products"
  | "orders"
  | "track"
  | "inventory"
  | "users"
  | "procurements"
  | "settings";

const ICON_SRC: Record<NavIconName, string> = {
  dashboard: "/images/icons/dashboard.png",
  overview: "/images/icons/overview.png",
  shop: "/images/icons/shop.png",
  products: "/images/icons/products.png",
  orders: "/images/icons/orders.png",
  track: "/images/icons/track.png",
  inventory: "/images/icons/inventory.png",
  users: "/images/icons/users.png",
  // package icon also used for procurements until a dedicated asset is provided
  procurements: "/images/icons/orders.png",
  settings: "/images/icons/settings.png",
};

/** Uses the provided icon assets; colored via currentColor (works on active lime). */
export function NavIcon({
  name,
  className,
}: {
  name: NavIconName;
  className?: string;
}) {
  const src = ICON_SRC[name];

  return (
    <span
      className={cn("inline-block size-5 shrink-0 bg-current", className)}
      style={{
        maskImage: `url(${src})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
      aria-hidden
    />
  );
}
