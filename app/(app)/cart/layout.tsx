import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
