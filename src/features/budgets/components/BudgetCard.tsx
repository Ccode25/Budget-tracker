"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Budget } from "@/types/budget";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  budget: Budget;
  onClick?: () => void;
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
}

export function BudgetCard({ budget, onClick, onEdit, onDelete }: BudgetCardProps) {
  const pct = budget.totalLimit > 0 ? Math.round((budget.totalSpent / budget.totalLimit) * 100) : 0;
  const remaining = budget.totalLimit - budget.totalSpent;
  const isOver = pct >= 90;

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-md border-border"
      onClick={onClick}
    >
      <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: budget.color }}
          />
          <CardTitle className="text-sm font-semibold text-foreground">{budget.name}</CardTitle>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="capitalize text-[10px]">
            {budget.period}
          </Badge>
          {isOver && (
            <Badge variant="destructive" className="text-[10px]">
              Over 90%
            </Badge>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(budget);
              }}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
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
              className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              title="Delete Budget"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">
              ₱{budget.totalSpent.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              of ₱{budget.totalLimit.toLocaleString()} limit
            </p>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "text-sm font-bold",
                remaining < 0 ? "text-destructive" : "text-emerald-500"
              )}
            >
              ₱{remaining.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">remaining</p>
          </div>
        </div>

        <Progress
          value={pct}
          className={cn(
            "h-2",
            isOver
              ? "[&>div]:bg-destructive"
              : pct >= 75
              ? "[&>div]:bg-amber-500"
              : "[&>div]:bg-primary"
          )}
        />

        {/* Category preview */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>{budget.categories.length} categories</span>
          <span>
            Target: {new Date(budget.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
