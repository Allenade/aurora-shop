import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ViewAllLink } from "@/components/ui/view-all-link";
import type { RecentOrder } from "@/lib/dashboard";

function statusTone(status: RecentOrder["status"]) {
  if (status === "In Transit") return "blue" as const;
  if (status === "Delivered") return "green" as const;
  return "orange" as const;
}

export function RecentPurchases({ orders }: { orders: RecentOrder[] }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-[#f0f0f0] px-5 py-4">
        <h2 className="text-base font-semibold text-aurora-ink">
          Recent Purchases
        </h2>
        <p className="mt-0.5 text-xs text-[#8a8a8a]">
          Orders in the past 60 Days.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#f0f0f0] text-xs tracking-wide text-[#9a9a9a] uppercase">
              <th className="px-5 py-3 font-medium">Order ID</th>
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 font-medium">Items</th>
              <th className="px-3 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
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
                    href="/orders"
                    className="font-medium text-[#2f6fed] hover:underline"
                  >
                    {order.id}
                  </Link>
                </td>
                <td className="px-3 py-3.5 text-[#5f5f5f]">{order.date}</td>
                <td className="px-3 py-3.5 text-[#5f5f5f]">{order.items}</td>
                <td className="px-3 py-3.5 font-medium text-aurora-ink">
                  {order.total}
                </td>
                <td className="px-5 py-3.5">
                  <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-auto border-t border-[#f0f0f0] px-5 py-3.5">
        <ViewAllLink href="/orders">View All Orders</ViewAllLink>
      </div>
    </Card>
  );
}
