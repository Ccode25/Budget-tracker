import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication — BudgetTracker",
  description: "Secure account access and authentication for BudgetTracker.",
};

export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
