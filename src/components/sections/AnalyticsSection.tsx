"use client";

import { PieChart, TrendingUp, DollarSign, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LANDING_MOCK_CATEGORIES, LANDING_MOCK_MONTHLY_TRENDS } from "@/lib/mock-landing-data";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export function AnalyticsSection() {
  return (
    <section id="analytics" className="py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs gap-1.5 border-purple-500/40 bg-purple-500/10 text-purple-400 rounded-full font-medium">
            <PieChart className="h-3.5 w-3.5" /> Revolut-Inspired Analytics
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Deep Financial Insights & Category Intelligence
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Visualize category distribution, monitor cash flow velocity, and track monthly net savings at a glance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Pie Chart Card */}
          <Card className="lg:col-span-6 border-border/60 bg-card/90 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-400" /> Spending Distribution by Category
              </CardTitle>
              <CardDescription className="text-xs">July 2026 Monthly Breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={LANDING_MOCK_CATEGORIES}
                      dataKey="spent"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {LANDING_MOCK_CATEGORIES.map((cat, idx) => (
                        <Cell key={`cell-${idx}`} fill={cat.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`₱${Number(val).toLocaleString()}`, "Spent"]}
                      contentStyle={{ backgroundColor: "#1e1e24", borderColor: "#333", borderRadius: "8px", fontSize: "12px" }}
                    />
                    <Legend
                      formatter={(val: string) => <span className="text-xs text-muted-foreground">{val}</span>}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Key Metric Highlights Grid */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-border/60 bg-card/80 p-5 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold">Top Spending Category</span>
                  <Activity className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-xl font-bold text-foreground">Food & Dining</div>
                <div className="text-xs text-muted-foreground">₱12,450 spent (38.3% of total)</div>
              </Card>

              <Card className="border-border/60 bg-card/80 p-5 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold">Average Daily Spend</span>
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-xl font-bold text-foreground">₱1,046.77 / day</div>
                <div className="text-xs text-emerald-500 font-medium">14% below limit rate</div>
              </Card>
            </div>

            <Card className="border-border/60 bg-card/80 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Historical 6-Month Savings Surge</span>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  +34% Growth
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By identifying budget leaks across dining and entertainment, users save an average of ₱18,500 more per quarter using visual analytics.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
