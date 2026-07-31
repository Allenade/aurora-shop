import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Created",
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
