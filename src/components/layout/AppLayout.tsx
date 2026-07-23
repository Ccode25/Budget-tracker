"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
