"use client";

import { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export function TransactionFiltersButton({
  open,
  onToggle,
  onReset,
  hasActive,
}: {
  open: boolean;
  onToggle: () => void;
  onReset: () => void;
  hasActive: boolean;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button
        variant="outline"
        size="sm"
        className={cn("h-8 gap-1.5 px-2.5 text-xs font-medium", open && "bg-muted")}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="filter-panel"
      >
        <Filter size={13} aria-hidden />
        Filters
        {hasActive && (
          <Badge className="h-3.5 min-w-3.5 rounded-full p-0 flex items-center justify-center text-[9px] font-bold bg-primary text-primary-foreground">
            !
          </Badge>
        )}
        <ChevronDown
          size={11}
          className={cn("transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </Button>

      {hasActive && (
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={onReset}>
          <X size={11} aria-hidden /> Clear
        </Button>
      )}
    </div>
  );
}

export function TransactionFilterPanel({
  filters,
  onUpdate,
}: {
  filters: TransactionFilters;
  onUpdate: <K extends keyof TransactionFilters>(k: K, v: TransactionFilters[K]) => void;
}) {
  return (
    <div
      id="filter-panel"
      className="w-full max-w-lg ml-auto rounded-xl border border-border bg-card p-3 shadow-md space-y-2.5 animate-in fade-in-0 slide-in-from-top-1"
      role="group"
      aria-label="Transaction filters"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Type Filter */}
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Type
          </p>
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => onUpdate("types", toggleArrayItem(filters.types, t.value))}
                className={cn(
                  "rounded-md border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                  filters.types.includes(t.value)
                    ? "border-primary bg-primary/15 text-primary font-semibold"
                    : "border-border/70 bg-muted/30 text-foreground hover:bg-muted/60",
                )}
                aria-pressed={filters.types.includes(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Status
          </p>
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => onUpdate("statuses", toggleArrayItem(filters.statuses, s.value))}
                className={cn(
                  "rounded-md border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                  filters.statuses.includes(s.value)
                    ? "border-primary bg-primary/15 text-primary font-semibold"
                    : "border-border/70 bg-muted/30 text-foreground hover:bg-muted/60",
                )}
                aria-pressed={filters.statuses.includes(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-border/40">
        <div>
          <label htmlFor="date-from" className="mb-1 block text-[11px] font-medium text-muted-foreground">
            From Date
          </label>
          <input
            id="date-from"
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(e) => onUpdate("dateFrom", e.target.value || null)}
            className="h-8 w-full rounded-md border border-border/80 bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="date-to" className="mb-1 block text-[11px] font-medium text-muted-foreground">
            To Date
          </label>
          <input
            id="date-to"
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) => onUpdate("dateTo", e.target.value || null)}
            className="h-8 w-full rounded-md border border-border/80 bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}

export function TransactionFilters({
  filters,
  onUpdate,
  onReset,
  hasActive,
}: TransactionFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full space-y-2.5">
      <TransactionFiltersButton
        open={open}
        onToggle={() => setOpen((v) => !v)}
        onReset={onReset}
        hasActive={hasActive}
      />
      {open && <TransactionFilterPanel filters={filters} onUpdate={onUpdate} />}
    </div>
  );
}
