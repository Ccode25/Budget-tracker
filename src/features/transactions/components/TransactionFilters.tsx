"use client";

import { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_CATEGORIES } from "@/features/categories/mock/categories";
import type { TransactionFilters, TransactionType, TransactionStatus } from "@/types/transaction";
import { cn } from "@/lib/utils";

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onUpdate: <K extends keyof TransactionFilters>(k: K, v: TransactionFilters[K]) => void;
  onReset: () => void;
  hasActive: boolean;
}

const TYPES: { label: string; value: TransactionType }[] = [
  { label: "Income",   value: "income"   },
  { label: "Expense",  value: "expense"  },
  { label: "Transfer", value: "transfer" },
];

const STATUSES: { label: string; value: TransactionStatus }[] = [
  { label: "Completed", value: "completed" },
  { label: "Pending",   value: "pending"   },
  { label: "Failed",    value: "failed"    },
];

function toggleArrayItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export function TransactionFilters({
  filters,
  onUpdate,
  onReset,
  hasActive,
}: TransactionFiltersProps) {
  const [open, setOpen] = useState(false);

  const expenseCategories = MOCK_CATEGORIES.filter(
    (c) => c.type === "expense" || c.type === "both",
  );
  const incomeCategories = MOCK_CATEGORIES.filter(
    (c) => c.type === "income" || c.type === "both",
  );

  return (
    <div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", open && "bg-muted")}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="filter-panel"
        >
          <Filter size={14} aria-hidden />
          Filters
          {hasActive && (
            <Badge className="h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px]">
              !
            </Badge>
          )}
          <ChevronDown
            size={12}
            className={cn("transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </Button>

        {hasActive && (
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={onReset}>
            <X size={12} aria-hidden /> Clear
          </Button>
        )}
      </div>

      {open && (
        <div
          id="filter-panel"
          className="mt-3 rounded-xl border border-border bg-card p-4 shadow-md space-y-4"
          role="group"
          aria-label="Transaction filters"
        >
          {/* Type */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Type
            </p>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onUpdate("types", toggleArrayItem(filters.types, t.value))}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filters.types.includes(t.value)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted/40 text-foreground hover:bg-muted",
                  )}
                  aria-pressed={filters.types.includes(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onUpdate("statuses", toggleArrayItem(filters.statuses, s.value))}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filters.statuses.includes(s.value)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted/40 text-foreground hover:bg-muted",
                  )}
                  aria-pressed={filters.statuses.includes(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="date-from" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                From
              </label>
              <input
                id="date-from"
                type="date"
                value={filters.dateFrom ?? ""}
                onChange={(e) => onUpdate("dateFrom", e.target.value || null)}
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="date-to" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                To
              </label>
              <input
                id="date-to"
                type="date"
                value={filters.dateTo ?? ""}
                onChange={(e) => onUpdate("dateTo", e.target.value || null)}
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
