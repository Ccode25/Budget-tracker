"use client";

import { PieChart, Wallet, Shield, FileSpreadsheet, Target, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Wallet,
    title: "Real-time Expense Tracking",
    description: "Categorize every income and expense transaction effortlessly with custom color badges and merchant tags.",
  },
  {
    icon: PieChart,
    title: "Visual Budget Analytics",
    description: "Interactive Recharts breakdown showing cash flow, spending trends, and category distribution.",
  },
  {
    icon: Target,
    title: "Savings Goals Tracker",
    description: "Define financial targets (emergency fund, travel, new car) and monitor target progress percentages.",
  },
  {
    icon: FileSpreadsheet,
    title: "CSV & XLSX Statement Import",
    description: "Drag-and-drop bank statements with automated column mapper, categorizer, and duplicate detector.",
  },
  {
    icon: RefreshCw,
    title: "Multi-Currency & Regional Support",
    description: "Full Philippine Peso (₱) localization support alongside multi-currency settings.",
  },
  {
    icon: Shield,
    title: "Neon Cloud Postgres Persistence",
    description: "Serverless PostgreSQL database storage with short-lived JWTs and secure refresh token rotation.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/20 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Everything You Need for Total Financial Control
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Built with modern web standards, sleek dark mode themes, and robust database architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="border-border/60 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed mt-2">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
