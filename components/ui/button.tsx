import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "lime" | "outline" | "ghost" | "soft";
  size?: "sm" | "md" | "lg";
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "lg" && "h-12 px-5 text-[15px]",
        variant === "primary" &&
          "bg-aurora-ink text-white hover:opacity-90",
        variant === "lime" &&
          "bg-aurora-lime text-aurora-ink hover:opacity-90",
        variant === "outline" &&
          "border border-aurora-ink/20 bg-white text-aurora-ink hover:bg-[#f7f7f7]",
        variant === "ghost" &&
          "bg-transparent text-[#6b7280] hover:text-aurora-ink",
        variant === "soft" &&
          "border border-aurora-ink/15 bg-white text-aurora-ink hover:bg-white/80",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
