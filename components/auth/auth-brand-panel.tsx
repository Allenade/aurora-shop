import Image from "next/image";
import { AUTH_FEATURES } from "@/lib/auth";

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.2 19 6.2v4.4c0 4.5-2.9 8.5-7 10-4.1-1.5-7-5.5-7-10V6.2L12 3.2Z"
        stroke="#151514"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9.2 12.1 1.9 1.9 3.8-4"
        stroke="#151514"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 16V7.5h10V16M13 10.5h3.6L19.5 13v3H13M7 18.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Zm9.2 0a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z"
        stroke="#151514"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.8 13.8v-2A7.2 7.2 0 0 1 12 4.6a7.2 7.2 0 0 1 7.2 7.2v2M4.8 13.8A2 2 0 0 0 6.8 15.8H7.5v-3.5H6.8a2 2 0 0 0-2 1.5Zm14.4 0a2 2 0 0 1-2 2H16.5v-3.5h.7a2 2 0 0 1 2 1.5ZM12 19.2h2.2a2.2 2.2 0 0 0 2.2-2.2v-.7"
        stroke="#151514"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7.5 4h6l4 4.2V20h-10V4Zm6 0V8.2H17M9.5 11.5h5M9.5 14.5h5M9.5 17.5h3.2"
        stroke="#151514"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = [ShieldIcon, TruckIcon, HeadsetIcon, QuoteIcon];

/** Left brand panel — photo + lime feature list (split auth layout). */
export function AuthBrandPanel() {
  return (
    <aside className="relative hidden h-full w-full overflow-hidden lg:block">
      <Image
        src="/images/auth-panel.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

      <ul className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 px-10 pb-12 xl:px-14 xl:pb-14">
        {AUTH_FEATURES.map((feature, index) => {
          const Icon = ICONS[index]!;
          return (
            <li
              key={feature}
              className="auth-rise flex items-center gap-3"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-aurora-lime">
                <Icon />
              </span>
              <span className="text-[15px] font-medium text-white">
                {feature}
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
