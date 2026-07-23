"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 p-8 sm:p-14 text-white shadow-2xl overflow-hidden">
          {/* Subtle background circles */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to take full control of your finances?
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Join thousands of users who track budgets, manage spending, and achieve their savings goals with BudgetTracker.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-medium text-white/90">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Free 14-day demo access</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Instant CSV import</span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="h-12 px-6 font-bold shadow-lg">
                  Get Started Free <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/dashboard?demo=true">
                <Button size="lg" variant="outline" className="h-12 px-6 bg-white/10 hover:bg-white/20 border-white/30 text-white">
                  Launch Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
