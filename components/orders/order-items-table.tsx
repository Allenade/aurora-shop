import Image from "next/image";
import type { OrderLineItem, OrderRecord } from "@/lib/orders";

function ItemRow({ item }: { item: OrderLineItem }) {
  return (
    <tr className="border-b border-[#ececec] last:border-b-0">
      <td className="py-4 pr-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-[#ececec] bg-[#f7f7f7]">
            <Image
              src={item.image}
              alt=""
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-aurora-ink">
              {item.name}
            </p>
            {item.description ? (
              <p className="mt-0.5 truncate text-xs text-[#9a9a9a]">
                {item.description}
              </p>
            ) : null}
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-[#6b7280]">
        {item.sku}
      </td>
      <td className="px-3 py-4 text-center text-sm font-medium text-aurora-ink">
        {item.qty}
      </td>
      <td className="px-3 py-4 text-right text-sm whitespace-nowrap text-[#6b7280]">
        {item.unitPriceLabel}
      </td>
      <td className="py-4 pl-3 text-right text-sm font-semibold whitespace-nowrap text-aurora-ink">
        {item.totalLabel}
      </td>
    </tr>
  );
}

export function OrderItemsTable({ order }: { order: OrderRecord }) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-bold text-aurora-ink">Order Items</h2>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          {order.itemCount} Products in this order
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#ececec]">
              <th className="pb-3 pr-4 text-xs font-semibold tracking-wide text-[#9a9a9a] uppercase">
                Product
              </th>
              <th className="px-3 pb-3 text-xs font-semibold tracking-wide text-[#9a9a9a] uppercase">
                SKU
              </th>
              <th className="px-3 pb-3 text-center text-xs font-semibold tracking-wide text-[#9a9a9a] uppercase">
                Qty
              </th>
              <th className="px-3 pb-3 text-right text-xs font-semibold tracking-wide text-[#9a9a9a] uppercase">
                Unit Price
              </th>
              <th className="pb-3 pl-3 text-right text-xs font-semibold tracking-wide text-[#9a9a9a] uppercase">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
