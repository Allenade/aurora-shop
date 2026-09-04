import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { TrackedShipment, TrackStatus } from "@/lib/track-orders";
import { cn } from "@/lib/utils";

function statusTone(status: TrackStatus) {
  if (status === "Delivered") return "green" as const;
  if (status === "Processing") return "orange" as const;
  if (status === "Out for Delivery") return "blue" as const;
  return "blue" as const;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium tracking-wide text-[#9a9a9a] uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-aurora-ink">{value}</p>
    </div>
  );
}

type TrackOrderResultProps = {
  shipment: TrackedShipment;
};

export function TrackOrderResult({ shipment }: TrackOrderResultProps) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-aurora-ink sm:text-xl">
            Order #{shipment.orderId}
          </h2>
          <p className="mt-1 text-sm text-[#8a8a8a]">
            Tracking Number:{" "}
            <span className="font-medium text-aurora-ink">
              {shipment.trackingNumber}
            </span>
          </p>
        </div>
        <Badge tone={statusTone(shipment.status)}>{shipment.status}</Badge>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Meta label="Estimated Delivery" value={shipment.estimatedDelivery} />
        <Meta label="Shipping Method" value={shipment.shippingMethod} />
        <Meta label="Destination" value={shipment.destination} />
      </div>

      <ol className="mt-5 space-y-0 border-t border-[#e8e8e8] pt-6">
        {shipment.timeline.map((step, index) => {
          const isLast = index === shipment.timeline.length - 1;
          const done = step.status === "done";

          return (
            <li key={step.id} className="relative flex gap-3.5 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  className={cn(
                    "absolute top-7 left-[11px] h-[calc(100%-1.25rem)] w-0.5",
                    done ? "bg-[#86efac]" : "bg-[#e5e5e5]",
                  )}
                  aria-hidden
                />
              ) : null}

              <span
                className={cn(
                  "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full",
                  done
                    ? "bg-[#dcfce7] text-[#16a34a]"
                    : "border-2 border-[#d4d4d4] bg-white",
                )}
              >
                {done ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M2.5 6.2 4.8 8.5 9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>

              <div className="flex min-w-0 flex-1 items-start justify-between gap-4 pt-0.5">
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      done ? "text-aurora-ink" : "text-[#9a9a9a]",
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-sm text-[#8a8a8a]">
                    {step.description}
                  </p>
                </div>
                {step.at ? (
                  <p className="shrink-0 pt-0.5 text-right text-xs whitespace-nowrap text-[#9a9a9a]">
                    {step.at}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-2 border-t border-[#f0f0f0] pt-5">
        <h3 className="text-base font-bold text-aurora-ink">Order Items</h3>
        <ul className="mt-4 divide-y divide-[#f0f0f0]">
          {shipment.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#f3f3f3]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-aurora-ink">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-[#8a8a8a]">
                  Quantity: {item.quantity} Units
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-aurora-ink">
                {item.priceLabel}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
