"use client";

import { useState } from "react";
import {
  LANDING_MOCK_STATS,
  LANDING_MOCK_BUDGETS,
  LANDING_MOCK_TRANSACTIONS,
  LANDING_MOCK_GOALS,
  LANDING_MOCK_MONTHLY_TRENDS,
} from "@/lib/mock-landing-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function DashboardPreviewSection() {
  const [activeTab, setActiveTab] = useState<"overview" | "budgets" | "transactions" | "goals">("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = LANDING_MOCK_TRANSACTIONS.filter((t) =>
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="demo" className="py-16 bg-muted/20 border-y border-border/40 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <Badge variant="outline" className="px-3.5 py-1 text-xs gap-1.5 border-primary/30 bg-primary/10 text-primary rounded-full">
            Interactive Product Demo
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Experience the Dashboard Live
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Explore real-time budgeting, category caps, and transaction parsing below using demo data.
          </p>
        </div>

        {/* Browser Mockup Container */}
        <div className="rounded-2xl border border-border/70 bg-card shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
          {/* Top Browser Bar */}
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-background/80 px-3 py-1 text-xs font-mono text-muted-foreground border border-border/40">
              <span>app.budgettracker.com/dashboard?demo=true</span>
            </div>
            <div className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Demo Mode Active
            </div>
          </div>

          {/* Interactive Navigation Tabs inside Mockup */}
          <div className="border-b border-border/40 bg-card px-4 sm:px-6 pt-3 flex flex-wrap gap-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("overview")}
              className="gap-2 text-xs h-9"
            >
              <Wallet className="h-3.5 w-3.5" /> Overview
            </Button>
            <Button
              variant={activeTab === "budgets" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("budgets")}
              className="gap-2 text-xs h-9"
            >
              <PieIcon className="h-3.5 w-3.5" /> Monthly Budgets
            </Button>
            <Button
              variant={activeTab === "transactions" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("transactions")}
              className="gap-2 text-xs h-9"
            >
              <TrendingUp className="h-3.5 w-3.5" /> Transactions
            </Button>
            <Button
              variant={activeTab === "goals" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("goals")}
              className="gap-2 text-xs h-9"
            >
              <Target className="h-3.5 w-3.5" /> Savings Goals
            </Button>
          </div>

          {/* Tab Content Display */}
          <div className="p-4 sm:p-6 space-y-6 bg-background/50 min-h-[460px]">
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-border/60 bg-card/80">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground">Total Balance</CardTitle>
                      <Wallet className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₱{LANDING_MOCK_STATS.totalBalance.toLocaleString()}</div>
                      <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1 font-medium">
                        <ArrowUpRight className="h-3.5 w-3.5" /> +12.4% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/60 bg-card/80">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground">Monthly Income</CardTitle>
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-emerald-500">₱{LANDING_MOCK_STATS.monthlyIncome.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground mt-1">July 2026 Salary</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/60 bg-card/80">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground">Monthly Expenses</CardTitle>
                      <ArrowDownRight className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">₱{LANDING_MOCK_STATS.monthlyExpenses.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground mt-1">64.9% of ₱50,000 Budget</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/60 bg-card/80">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground">Savings Rate</CardTitle>
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{LANDING_MOCK_STATS.savingsRate}%</div>
                      <p className="text-xs text-emerald-500 font-medium mt-1">₱{LANDING_MOCK_STATS.totalSaved.toLocaleString()} Saved</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Chart & Recent Transactions Split */}
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                  {/* Recharts Monthly Cash Flow */}
                  <Card className="lg:col-span-4 border-border/60 bg-card/80">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold">Cash Flow & Savings Trend (2026)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={LANDING_MOCK_MONTHLY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                            <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                            <YAxis stroke="#888888" fontSize={11} tickFormatter={(val) => `₱${val / 1000}k`} />
                            <Tooltip
                              formatter={(value: any) => [`₱${Number(value).toLocaleString()}`, ""]}
                              contentStyle={{ backgroundColor: "#1e1e24", borderColor: "#333", borderRadius: "8px" }}
                            />
                            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                            <Bar dataKey="expenses" fill="#6366f1" radius={[4, 4, 0, 0]} name="Expenses" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mini Recent Transactions */}
                  <Card className="lg:col-span-3 border-border/60 bg-card/80">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Recent Transactions</CardTitle>
                      <Badge variant="secondary" className="text-[10px]">July 2026</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {LANDING_MOCK_TRANSACTIONS.slice(0, 4).map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/30 text-xs">
                          <div>
                            <p className="font-semibold text-foreground">{t.description}</p>
                            <p className="text-muted-foreground text-[10px]">{t.date} • {t.category}</p>
                          </div>
                          <span className={`font-bold ${t.type === "income" ? "text-emerald-500" : "text-foreground"}`}>
                            {t.type === "income" ? "+" : "-"}₱{t.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "budgets" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">July 2026 Monthly Budget</h3>
                    <p className="text-xs text-muted-foreground">July 1, 2026 – July 31, 2026 (Strict Non-Overlapping Date Range)</p>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs">
                    Budget Active
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LANDING_MOCK_BUDGETS.map((b) => {
                    const percent = Math.round((b.spent / b.limit) * 100);
                    return (
                      <div key={b.id} className="p-4 rounded-xl border border-border/50 bg-card/80 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: b.color }} />
                            {b.name}
                          </span>
                          <span className="font-semibold text-muted-foreground">
                            ₱{b.spent.toLocaleString()} / ₱{b.limit.toLocaleString()}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(percent, 100)}%`,
                              backgroundColor: percent > 90 ? "#ef4444" : b.color,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{percent}% utilized</span>
                          <span>₱{(b.limit - b.spent).toLocaleString()} remaining</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder="Search demo transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 px-3 py-1.5 text-xs rounded-lg border border-border bg-muted/40 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="text-xs text-muted-foreground">{filteredTransactions.length} items shown</span>
                </div>

                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/80">
                  <div className="divide-y divide-border/40 text-xs">
                    {filteredTransactions.map((t) => (
                      <div key={t.id} className="p-3 flex items-center justify-between hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: t.categoryColor }}>
                            {t.category.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{t.description}</p>
                            <p className="text-[11px] text-muted-foreground">{t.merchant} • {t.date}</p>
                          </div>
                        </div>
                        <span className={`font-bold text-sm ${t.type === "income" ? "text-emerald-500" : "text-foreground"}`}>
                          {t.type === "income" ? "+" : "-"}₱{t.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "goals" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {LANDING_MOCK_GOALS.map((g) => {
                    const percent = Math.round((g.currentAmount / g.targetAmount) * 100);
                    return (
                      <div key={g.id} className="p-4 rounded-xl border border-border/50 bg-card/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground">{g.category}</span>
                          <Badge variant="secondary" className="text-[10px] gap-1">
                            <Calendar className="h-3 w-3" /> {g.targetDate}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-sm text-foreground">{g.title}</h4>
                        <div className="text-lg font-extrabold text-primary">
                          ₱{g.currentAmount.toLocaleString()}{" "}
                          <span className="text-xs font-normal text-muted-foreground">/ ₱{g.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-medium text-emerald-500">{percent}% achieved</span>
                          <span>₱{(g.targetAmount - g.currentAmount).toLocaleString()} to go</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
