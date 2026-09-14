"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { UserMenu } from "@/components/layout/user-menu";
import { useCartOptional } from "@/lib/cart-store";

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

type TopBarSearchProps = {
  searchPath: string;
};

function TopBarSearch({ searchPath }: TopBarSearchProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onSearchPage =
    pathname === searchPath || pathname.startsWith(`${searchPath}/`);
  const urlQuery = onSearchPage ? (searchParams.get("q")?.trim() ?? "") : "";

  // Remount when the URL query changes so the input stays in sync without an effect.
  return (
    <TopBarSearchField
      key={`${searchPath}:${urlQuery}`}
      searchPath={searchPath}
      initialValue={urlQuery}
    />
  );
}

function TopBarSearchField({
  searchPath,
  initialValue,
}: {
  searchPath: string;
  initialValue: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    const href = q
      ? `${searchPath}?q=${encodeURIComponent(q)}`
      : searchPath;
    router.push(href);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <SearchInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for components, parts, categories..."
        aria-label="Search products"
      />
    </form>
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
  const cart = useCartOptional();
  const count = showCart ? (cart?.itemCount ?? 0) : 0;
  const searchPath = showCart ? "/shop" : "/admin/products";

  return (
    <header className="flex h-[72px] shrink-0 items-center border-b border-[#ececec] bg-white px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 sm:gap-4">
        <div className="min-w-0 w-full max-w-xl">
          <Suspense
            fallback={
              <SearchInput
                placeholder="Search for components, parts, categories..."
                aria-label="Search products"
                disabled
              />
            }
          >
            <TopBarSearch searchPath={searchPath} />
          </Suspense>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {showCart ? (
            <Link
              href="/cart"
              className="relative inline-flex size-10 items-center justify-center rounded-full text-[#5f5f5f] hover:bg-[#f6f6f6]"
              aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
            >
              <CartIcon />
              {count > 0 ? (
                <span className="absolute top-1 right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-aurora-lime px-1 text-[10px] font-bold text-aurora-ink">
                  {count > 99 ? "99+" : count}
                </span>
              ) : null}
            </Link>
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
