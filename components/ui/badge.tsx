import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "blue" | "green" | "orange" | "gray" | "red";
  className?: string;
};

const TONES = {
  blue: "bg-[#e8f1ff] text-[#2f6fed]",
  green: "bg-[#e8f8ef] text-[#1f9d57]",
  orange: "bg-[#fff1e6] text-[#e67a2e]",
  red: "bg-[#fff1f1] text-[#d64545]",
  gray: "bg-[#f3f4f6] text-[#6b7280]",
} as const;

export function Badge({ children, tone = "gray", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
