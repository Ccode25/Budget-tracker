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
}

export function BudgetOverviewCard({
  budgetName,
  totalSpent,
  totalLimit,
  categories,
}: BudgetOverviewCardProps) {
  const totalPct = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
  const remaining = totalLimit - totalSpent;
  const top5 = categories.slice(0, 5);

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
        <p className="text-xs text-muted-foreground mt-1">{totalPct.toFixed(0)}% used · 9 days left</p>
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
