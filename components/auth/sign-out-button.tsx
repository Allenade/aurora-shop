"use client";

import { useRouter } from "next/navigation";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { logoutRequest } from "@/lib/bff/client";
import { cn } from "@/lib/utils";

type SignOutButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children?: ReactNode;
};

export function SignOutButton({
  className,
  children = "Sign out",
  ...props
}: SignOutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    if (pending) return;
    setPending(true);
    try {
      await logoutRequest();
    } catch {
      // Still leave the app shell even if the request fails.
    } finally {
      router.replace("/auth/signin");
      router.refresh();
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      {...props}
      onClick={handleSignOut}
      disabled={pending || props.disabled}
      className={cn(className)}
    >
      {children}
    </button>
  );
}
