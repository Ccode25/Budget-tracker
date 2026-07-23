"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DEMO_TRANSACTIONS } from "@/features/transactions/mock/transactions";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const isDemoQuery = params.get("demo") === "true";

      if (isDemoQuery) {
        // Initialize explicit Demo Mode Session with rich sample data
        window.localStorage.setItem(
          "budget_tracker_user",
          JSON.stringify({
            id: "usr-demo",
            name: "Demo User",
            email: "demo@example.com",
            isDemo: true,
          })
        );
        window.localStorage.setItem("budget_tracker_transactions", JSON.stringify(DEMO_TRANSACTIONS));
      }
    }
  }, []);

  return (
    <TooltipProvider>
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <div className="flex h-svh w-full overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />

        {/* Main Column */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />

          {/* Scrollable Content Area */}
          <main
            id="main-content"
            tabIndex={-1}
            className={cn(
              "flex-1 overflow-y-auto scrollbar-thin",
              "pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0",
            )}
          >
            {children}
          </main>

          <Footer />
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </TooltipProvider>
  );
}
