"use client";

import { SearchInput } from "@/components/ui/search-input";
import { UserMenu } from "@/components/layout/user-menu";

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3.5 5.5h2.2l1.1 11.2a1.5 1.5 0 0 0 1.5 1.3h8.6a1.5 1.5 0 0 0 1.5-1.3L19.5 8H7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="20" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4.2 1.5 5.5 1.5 5.5H5s1.5-1.3 1.5-5.5ZM10 18.5a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type TopBarProps = {
  /** Admin chrome hides the cart. */
  showCart?: boolean;
  profileHref?: string;
};

export function TopBar({
  showCart = true,
  profileHref = "/settings",
}: TopBarProps) {
  return (
    <header className="flex h-[72px] shrink-0 items-center border-b border-[#ececec] bg-white px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4">
        <div className="w-full max-w-xl">
          <SearchInput
            placeholder="Search for components, parts, categories..."
            aria-label="Search"
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {showCart ? (
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full text-[#5f5f5f] hover:bg-[#f6f6f6]"
              aria-label="Cart"
            >
              <CartIcon />
            </button>
          ) : null}
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full text-[#5f5f5f] hover:bg-[#f6f6f6]"
            aria-label="Notifications"
          >
            <BellIcon />
          </button>
          <UserMenu profileHref={profileHref} />
        </div>
      </div>
    </header>
  );
}
