import type { ShopProduct } from "@/lib/shop";

function HighlightIcon({
  icon,
}: {
  icon: ShopProduct["highlights"][number]["icon"];
}) {
  const stroke = "#6b7280";
  if (icon === "verified") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3.2 19 6.2v4.4c0 4.5-2.9 8.5-7 10-4.1-1.5-7-5.5-7-10V6.2L12 3.2Z"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="m9.2 12.1 1.9 1.9 3.8-4"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (icon === "support") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4.8 13.8v-2A7.2 7.2 0 0 1 12 4.6a7.2 7.2 0 0 1 7.2 7.2v2"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M4.8 13.8A2 2 0 0 0 6.8 15.8H7.5v-3.5H6.8a2 2 0 0 0-2 1.5Zm14.4 0a2 2 0 0 1-2 2H16.5v-3.5h.7a2 2 0 0 1 2 1.5Z"
          stroke={stroke}
          strokeWidth="1.6"
        />
      </svg>
    );
  }
  if (icon === "returns") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7 7H4.5v3M4.8 10A7.2 7.2 0 1 0 7.2 6.2"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 16V7.5h10V16M13 10.5h3.6L19.5 13v3H13M7 18.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Zm9.2 0a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProductHighlights({
  highlights,
}: {
  highlights: ShopProduct["highlights"];
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[#e0e0e0] pt-5 sm:grid-cols-4">
      {highlights.map((item) => (
        <div key={item.label} className="flex flex-col gap-2">
          <HighlightIcon icon={item.icon} />
          <span className="text-xs leading-snug text-[#6b7280]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
