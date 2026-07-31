import { notFound } from "next/navigation";
import { OrderDetail } from "@/components/orders/order-detail";
import { OrderDetailGate } from "@/components/orders/order-detail-gate";
import { getOrderById } from "@/lib/orders";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(decodeURIComponent(id));
  if (!order) notFound();

  return (
    <OrderDetailGate>
      <OrderDetail order={order} />
    </OrderDetailGate>
  );
}
