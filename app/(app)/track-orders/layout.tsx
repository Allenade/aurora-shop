import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Orders",
};

export default function TrackOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
