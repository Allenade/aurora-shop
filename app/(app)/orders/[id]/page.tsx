import { OrderDetailLoader } from "@/components/orders/order-detail-loader";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailLoader id={decodeURIComponent(id)} />;
}
