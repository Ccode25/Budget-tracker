"use client";

import { Pencil, Trash2, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import type { Budget, BudgetStatus } from "@/types/budget";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  budget: Budget;
  onClick?: () => void;
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
}

export function BudgetCard({ budget, onClick, onEdit, onDelete }: BudgetCardProps) {
  const amount = budget.amount ?? budget.totalLimit ?? 0;
  const totalExpenses = budget.totalExpenses ?? budget.totalSpent ?? 0;
  const remaining = budget.remainingBudget ?? amount - totalExpenses;
  const spentPct = budget.spentPercentage ?? (amount > 0 ? Math.round((totalExpenses / amount) * 100) : 0);
  const status: BudgetStatus = budget.status ?? (spentPct > 100 ? "Over Budget" : spentPct > 80 ? "Warning" : "Safe");

  const formatDateRange = (start: string, end: string) => {
    try {
      const s = new Date(start + "T00:00:00");
      const e = new Date(end + "T00:00:00");
      return `${format(s, "MMM d, yyyy")} – ${format(e, "MMM d, yyyy")}`;
    } catch {
      return `${start} – ${end}`;
    }
  };

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-md border-border relative overflow-hidden"
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: budget.color || "#7c3aed" }} />
      <CardHeader className="pb-2 flex-row items-center justify-between space-y-0 pt-4">
        <div>
          <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
            {budget.name}
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </CardTitle>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Calendar size={12} className="shrink-0" />
            {formatDateRange(budget.startDate, budget.endDate)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge
            variant="outline"
            className={cn(
              "text-[11px] font-medium px-2 py-0.5 rounded-full border",
              status === "Over Budget" && "bg-destructive/10 text-destructive border-destructive/20",
              status === "Warning" && "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
              status === "Safe" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
            )}
          >
            {status}
          </Badge>
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(budget);
              }}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Edit Budget"
            >
              <Pencil size={13} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(budget.id);
              }}
              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              title="Delete Budget"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 pt-2 text-center bg-muted/40 p-2.5 rounded-lg border border-border/50">
          <div>
            <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Budget</p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              ₱{amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Expenses</p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              ₱{totalExpenses.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Remaining</p>
            <p
              className={cn(
                "text-sm font-bold mt-0.5",
                remaining < 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
              )}
            >
              ₱{remaining.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Progress</span>
            <span className={cn(
              status === "Over Budget" ? "text-destructive" : status === "Warning" ? "text-amber-600 dark:text-amber-400" : "text-foreground"
            )}>
              {Math.round(spentPct)}% spent
            </span>
          </div>
          <Progress
            value={Math.min(spentPct, 100)}
            className={cn(
              "h-2",
              status === "Over Budget"
                ? "[&>div]:bg-destructive"
                : status === "Warning"
                ? "[&>div]:bg-amber-500"
                : "[&>div]:bg-emerald-500"
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

