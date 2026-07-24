"use client";

import { signIn } from "next-auth/react";
import { ArrowRight, ShieldCheck, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleScrollToDemo = () => {
    const el = document.getElementById("demo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <Badge
            variant="outline"
            className="px-4 py-1.5 text-xs gap-2 border-primary/40 bg-primary/10 text-primary rounded-full font-medium backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            Revolut-Style Personal Finance & Budgeting
          </Badge>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            Master Your Money with{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              Complete Control & Precision
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Set non-overlapping monthly budgets, track live expenses, import bank statements, and achieve savings goals with a dark-first SaaS interface.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              size="lg"
              onClick={handleGoogleLogin}
              className="w-full sm:w-auto gap-3 shadow-xl shadow-primary/25 h-12 px-7 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-95 transition-all"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleScrollToDemo}
              className="w-full sm:w-auto h-12 px-6 border-border/80 hover:bg-muted/80 font-medium"
            >
              View Interactive Demo
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Bank-Grade 256-Bit SSL
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingUp className="h-4 w-4 text-primary" /> Live Financial Analytics
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-blue-500" /> Non-Overlapping Date Budgets
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
