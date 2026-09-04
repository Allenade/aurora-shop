import {
  DELIVERY_METHODS,
  formatCartMoney,
  type DeliveryMethodId,
} from "@/lib/cart";
import { cn } from "@/lib/utils";

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7.5h10V16H3V7.5Zm10 3h3.6L19.5 13v3H13M7 18.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Zm9.2 0a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M13 3 5.5 13.5H12l-1 7.5L18.5 10H12L13 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type DeliveryMethodPickerProps = {
  value: DeliveryMethodId;
  onChange: (id: DeliveryMethodId) => void;
};

export function DeliveryMethodPicker({
  value,
  onChange,
}: DeliveryMethodPickerProps) {
  return (
    <div>
      <h2 className="text-base font-bold text-aurora-ink">Delivery Method</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {DELIVERY_METHODS.map((method) => {
          const selected = value === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onChange(method.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-colors",
                selected
                  ? "border-aurora-lime bg-[#f3ffc7]"
                  : "border-[#e5e5e5] bg-white hover:border-[#d0d0d0]",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  selected
                    ? "bg-aurora-lime text-aurora-ink"
                    : "bg-[#f3f3f3] text-[#5f5f5f]",
                )}
              >
                {method.id === "standard" ? <TruckIcon /> : <BoltIcon />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-aurora-ink">
                  {method.label}
                </span>
                <span className="mt-0.5 block text-xs text-[#8a8a8a]">
                  {method.description}
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-aurora-ink">
                {formatCartMoney(method.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
