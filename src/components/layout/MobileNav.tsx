"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const mobileNavItems: MobileNavItem[] = [
  { label: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Budget",       href: "/budget",       icon: PiggyBank },
  { label: "Goals",        href: "/goals",        icon: Target },
  { label: "Analytics",    href: "/analytics",    icon: BarChart3 },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 inset-x-0 z-30",
        "flex md:hidden items-stretch",
        "border-t border-border bg-background/95 backdrop-blur-md",
        "pb-[env(safe-area-inset-bottom)]",
      )}
      aria-label="Mobile navigation"
    >
      {mobileNavItems.map((item) => {
        const isActive =
          item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.label}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 min-h-[56px]",
              "text-xs font-medium transition-colors duration-150",
              "focus-visible:bg-muted focus-visible:outline-none",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <div className="relative flex items-center justify-center">
              <item.icon size={20} aria-hidden />
              {isActive && (
                <span
                  className="absolute -bottom-1.5 h-1 w-4 rounded-full bg-primary"
                  aria-hidden
                />
              )}
            </div>
            <span className="leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
