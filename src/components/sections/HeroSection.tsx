"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <Badge variant="outline" className="px-3.5 py-1 text-xs gap-1.5 border-primary/30 bg-primary/5 text-primary rounded-full">
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen Personal Finance Tracker
          </Badge>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Master Your Money with <span className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent">Complete Clarity</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Track daily expenses, set category budget limits, import bank statements, and hit savings goals with Revolut-inspired analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/25 h-12 px-6">
                Start Free Today <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-6">
                Explore Live Demo
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Bank-grade Encryption</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-primary" /> Real-time Analytics</span>
          </div>
        </div>

        {/* Feature Visual Preview Card */}
        <div className="mt-14 rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-6 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-muted-foreground">budgettracker.app/dashboard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="rounded-xl border border-border/40 bg-muted/40 p-4">
              <span className="text-xs text-muted-foreground">Total Balance</span>
              <p className="text-2xl font-extrabold text-foreground mt-1">₱148,500.00</p>
              <span className="text-xs text-emerald-500 font-semibold mt-1 inline-block">+12.4% this month</span>
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/40 p-4">
              <span className="text-xs text-muted-foreground">Monthly Expenses</span>
              <p className="text-2xl font-extrabold text-foreground mt-1">₱32,450.00</p>
              <span className="text-xs text-muted-foreground mt-1 inline-block">78% of budget limit</span>
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/40 p-4">
              <span className="text-xs text-muted-foreground">Savings Rate</span>
              <p className="text-2xl font-extrabold text-emerald-500 mt-1">42.5%</p>
              <span className="text-xs text-muted-foreground mt-1 inline-block">₱24,000 saved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
