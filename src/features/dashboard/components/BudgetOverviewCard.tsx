"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BudgetCategory {
  categoryId: string;
  name: string;
  color: string;
  limit: number;
  spent: number;
  pct: number;
}

interface BudgetOverviewCardProps {
  budgetName: string;
  totalSpent: number;
  totalLimit: number;
  categories: BudgetCategory[];
  monthlyIncome?: number;
  endDate?: string;
}

function getDaysRemaining(endDateStr?: string): string {
  const now = new Date();
  let end: Date;
  if (endDateStr) {
    end = new Date(endDateStr.includes("T") ? endDateStr : endDateStr + "T23:59:59");
  } else {
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  }
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Period ended";
  if (diffDays === 0) return "Ends today";
  if (diffDays === 1) return "1 day left";
  return `${diffDays} days left`;
}

export function BudgetOverviewCard({
  budgetName,
  totalSpent,
  totalLimit,
  categories,
  monthlyIncome,
  endDate,
}: BudgetOverviewCardProps) {
  const totalPct = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
  const remaining = totalLimit - totalSpent;
  const top5 = categories.slice(0, 5);
  const daysLeftStr = getDaysRemaining(endDate);

  const budgetIncomeTally = monthlyIncome && monthlyIncome > 0 ? (totalLimit / monthlyIncome) * 100 : 0;
  const unbudgetedIncome = monthlyIncome ? Math.max(0, monthlyIncome - totalLimit) : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{budgetName}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Monthly overview</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Remaining</p>
          <p className={cn("text-sm font-bold", remaining < 0 ? "text-destructive" : "text-emerald-500")}>
            ₱{remaining.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Monthly Income Tally Banner */}
      {monthlyIncome !== undefined && monthlyIncome > 0 && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs flex flex-wrap items-center justify-between gap-1 text-emerald-800 dark:text-emerald-300">
          <div>
            <span className="font-semibold">Income Tally:</span> ₱{totalLimit.toLocaleString("en-PH")} budgeted of ₱{monthlyIncome.toLocaleString("en-PH")} ({budgetIncomeTally.toFixed(0)}%)
          </div>
          {unbudgetedIncome > 0 && (
            <span className="font-medium text-[11px] opacity-90">
              ₱{unbudgetedIncome.toLocaleString("en-PH")} unbudgeted
            </span>
          )}
        </div>
      )}

      {/* Donut-style total */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-2xl font-bold text-foreground">
            ₱{totalSpent.toLocaleString("en-PH", { minimumFractionDigits: 0 })}
          </span>
          <span className="text-sm text-muted-foreground">
            / ₱{totalLimit.toLocaleString("en-PH")}
          </span>
        </div>
        <Progress
          value={totalPct}
          className={cn("h-2", totalPct >= 90 ? "[&>div]:bg-destructive" : totalPct >= 70 ? "[&>div]:bg-amber-500" : "[&>div]:bg-primary")}
          aria-label={`${totalPct.toFixed(0)}% of budget used`}
        />
        <p className="text-xs text-muted-foreground mt-1">{totalPct.toFixed(0)}% used · {daysLeftStr}</p>
      </div>

      {/* Category bars */}
      <div className="space-y-3">
        {top5.map((cat, i) => (
          <motion.div
            key={cat.categoryId}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                  aria-hidden
                />
                <span className="font-medium text-foreground">{cat.name}</span>
              </div>
              <span className="text-muted-foreground tabular-nums">
                ₱{cat.spent.toFixed(0)} / ₱{cat.limit}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: cat.color }}
                initial={{ width: 0 }}
                animate={{ width: `${cat.pct}%` }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
