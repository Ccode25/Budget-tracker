"use client";

import { Calendar, ShieldAlert, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function BudgetManagementSection() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <section id="budgets" className="py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="outline" className="px-3.5 py-1 text-xs gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-500 rounded-full font-medium">
              <Calendar className="h-3.5 w-3.5" /> Date-Range Budgeting Engine
            </Badge>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Smart Monthly Budgets with <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Guaranteed Zero-Overlap Validation
              </span>
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed">
              Define precise budget windows (e.g. July 1–31). Every transaction is automatically assigned based on its transaction date. Our validation engine blocks overlapping periods to eliminate double-counting.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-foreground">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Automatic Transaction Matching:</span> Transactions with date <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-primary">2026-07-10</code> instantly route into your July budget.
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-foreground">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Overlap Protection:</span> Creating a budget spanning <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-rose-400">July 15 – Aug 15</code> is automatically rejected.
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-foreground">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Real-Time Utilization Alerts:</span> Color-coded warnings when spending hits 75% and 90% of cap.
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleGoogleLogin} className="gap-2 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold h-11 px-6">
                Try Budget System Now <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Column Validation UI Demo Card */}
          <div className="lg:col-span-6 space-y-4">
            {/* Valid Budget Example */}
            <Card className="border-emerald-500/40 bg-emerald-950/20 backdrop-blur-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs">
                    ✓ Valid Budget Period
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">July 2026</span>
                </div>
                <CardTitle className="text-lg font-bold text-foreground mt-2">July Monthly Budget</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">July 1, 2026 – July 31, 2026 • ₱50,000 Cap</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-background/60 border border-emerald-500/30 text-xs space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Spent: ₱32,450</span>
                    <span className="text-emerald-400">64.9% Utilized</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "64.9%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invalid Overlap Prevented Demo */}
            <Card className="border-rose-500/40 bg-rose-950/20 backdrop-blur-md opacity-90">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="destructive" className="text-xs gap-1">
                    <ShieldAlert className="h-3 w-3" /> Overlap Rejected
                  </Badge>
                  <span className="text-xs font-mono text-rose-400 font-bold">Validation Error</span>
                </div>
                <CardTitle className="text-base font-semibold text-rose-200 mt-2">Attempted: July 15 – August 15</CardTitle>
                <CardDescription className="text-xs text-rose-300/80">
                  "This budget overlaps an existing budget period (July 1 – July 31)."
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
