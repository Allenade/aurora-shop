import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ViewAllLink } from "@/components/ui/view-all-link";
import type { AdminRecentOrder } from "@/lib/admin";

function statusTone(status: AdminRecentOrder["status"]) {
  if (status === "In Transit") return "blue" as const;
  if (status === "Delivered") return "green" as const;
  return "orange" as const;
}

export function AdminRecentOrders({ orders }: { orders: AdminRecentOrder[] }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-[#f0f0f0] px-5 py-4">
        <h2 className="text-base font-semibold text-aurora-ink">Recent Orders</h2>
        <p className="mt-0.5 text-xs text-[#8a8a8a]">
          Orders in the past 60 Days
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#f0f0f0] text-xs tracking-wide text-[#9a9a9a] uppercase">
              <th className="px-5 py-3 font-medium">Order ID</th>
              <th className="px-3 py-3 font-medium">Customer</th>
              <th className="px-3 py-3 font-medium">Amount</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#f5f5f5] last:border-0"
              >
                <td className="px-5 py-3.5">
                  <Link
                    href="/admin/orders"
                    className="font-medium whitespace-nowrap text-[#2f6fed] hover:underline"
                  >
                    {order.id}
                  </Link>
                </td>
                <td className="px-3 py-3.5 text-[#5f5f5f]">{order.customer}</td>
                <td className="px-3 py-3.5 font-medium whitespace-nowrap text-aurora-ink">
                  {order.amount}
                </td>
                <td className="px-3 py-3.5">
                  <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-[#5f5f5f]">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-auto border-t border-[#f0f0f0] px-5 py-3.5">
        <ViewAllLink href="/admin/orders" className="text-aurora-ink">
          View All Orders
        </ViewAllLink>
      </div>
    </Card>
  );
}
