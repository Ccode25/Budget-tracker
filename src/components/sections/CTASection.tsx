"use client";

import { signIn } from "next-auth/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
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
    <section className="py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 p-8 sm:p-14 text-white shadow-2xl overflow-hidden">
          {/* Background circles */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to take full control of your finances?
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Join thousands of users who track budgets, manage spending, and achieve their savings goals with BudgetTracker.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-medium text-white/90">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Instant Google Sign-In</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Free CSV/XLSX Bank Importer</span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleGoogleLogin}
                className="h-12 px-7 font-bold shadow-lg gap-2 text-primary bg-white hover:bg-white/90"
              >
                <span>Continue with Google</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleScrollToDemo}
                className="h-12 px-6 bg-white/10 hover:bg-white/20 border-white/30 text-white font-medium"
              >
                Explore Live Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
