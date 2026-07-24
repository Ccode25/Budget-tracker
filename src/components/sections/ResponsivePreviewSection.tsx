"use client";

import { Smartphone, Monitor, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ResponsivePreviewSection() {
  return (
    <section id="responsive" className="py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs gap-1.5 border-primary/40 bg-primary/10 text-primary rounded-full font-medium">
            <Monitor className="h-3.5 w-3.5" /> Mobile & Desktop Optimized
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Flawless Control Across Every Screen & Device
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Whether on mobile, tablet, or widescreen 4K displays, BudgetTracker provides ultra-responsive touch controls and liquid dark mode layouts.
          </p>
        </div>

        {/* Dual Mockup Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Mobile Frame Mockup */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-[280px] h-[520px] rounded-[40px] border-4 border-muted-foreground/30 bg-card p-3 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="w-24 h-4 bg-muted-foreground/20 rounded-full mx-auto mb-2" />

              <div className="flex-1 space-y-3 p-2 bg-background/50 rounded-2xl overflow-hidden border border-border/30 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border/30">
                  <span className="font-bold text-foreground">BudgetTracker</span>
                  <span className="text-[10px] text-emerald-500 font-semibold">Active</span>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <span className="text-[10px] text-muted-foreground">Total Balance</span>
                  <p className="text-lg font-bold text-foreground mt-0.5">₱148,500.00</p>
                </div>
                <div className="p-2.5 rounded-lg bg-card border border-border/40 space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span>Food Budget</span>
                    <span>83%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full">
                    <div className="h-full bg-amber-500 rounded-full w-[83%]" />
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-card border border-border/40 space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span>Utilities</span>
                    <span>82%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full">
                    <div className="h-full bg-blue-500 rounded-full w-[82%]" />
                  </div>
                </div>
              </div>

              <div className="w-28 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-2" />
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-foreground">Touch-Optimized Controls</h4>
                  <p className="text-xs text-muted-foreground mt-1">Tap-friendly buttons, swipeable cards, and collapsible sidebars designed for thumb navigation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-foreground">Zero-Lag Instant Caching</h4>
                  <p className="text-xs text-muted-foreground mt-1">Client-side session caching ensures page transitions finish in under 5ms on mobile devices.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-foreground">Adaptive Dark Mode Aesthetics</h4>
                  <p className="text-xs text-muted-foreground mt-1">Dark mode by default reduces battery consumption on OLED displays while keeping text crystal clear.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
