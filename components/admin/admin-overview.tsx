import { AdminGreeting } from "@/components/admin/admin-greeting";
import { AdminOrderBreakdown } from "@/components/admin/admin-order-breakdown";
import { AdminRecentOrders } from "@/components/admin/admin-recent-orders";
import { AdminStats } from "@/components/admin/admin-stats";
import { AdminStockAlerts } from "@/components/admin/admin-stock-alerts";
import {
  ADMIN_RECENT_ORDERS,
  ADMIN_STATS,
  ORDER_BREAKDOWN,
  STOCK_ALERTS,
} from "@/lib/admin";

export function AdminOverview() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <AdminGreeting />
      <AdminStats stats={ADMIN_STATS} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.85fr)]">
        <AdminRecentOrders orders={ADMIN_RECENT_ORDERS} />
        <div className="flex flex-col gap-5">
          <AdminStockAlerts alerts={STOCK_ALERTS} />
          <AdminOrderBreakdown items={ORDER_BREAKDOWN} />
        </div>
      </div>
    </div>
  );
}
