"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ArrowUpDown, ArrowUp, ArrowDown,
  MoreHorizontal, Pencil, Trash2, ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet } from "lucide-react";
import type { TransactionSort } from "@/types/transaction";
import type { EnrichedTransaction } from "../hooks/useTransactions";
import { cn } from "@/lib/utils";

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive"> = {
  completed: "default",
  pending: "secondary",
  failed: "destructive",
};

function SortIcon({
  field,
  sort,
}: {
  field: TransactionSort["field"];
  sort: TransactionSort;
}) {
  if (sort.field !== field) return <ArrowUpDown size={12} className="text-muted-foreground" />;
  return sort.direction === "asc" ? (
    <ArrowUp size={12} className="text-primary" />
  ) : (
    <ArrowDown size={12} className="text-primary" />
  );
}

interface TransactionTableProps {
  transactions: EnrichedTransaction[];
  sort: TransactionSort;
  onSort: (field: TransactionSort["field"]) => void;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
  isLoading?: boolean;
}

const COLUMNS: Array<{ key: TransactionSort["field"] | "status" | "actions"; label: string; sortable: boolean; className: string }> = [
  { key: "date",        label: "Date",        sortable: true,  className: "w-28" },
  { key: "description", label: "Description", sortable: true,  className: "min-w-0 flex-1" },
  { key: "category",    label: "Category",    sortable: true,  className: "w-36 hidden sm:table-cell" },
  { key: "amount",      label: "Amount",      sortable: true,  className: "w-28 text-right" },
  { key: "status",      label: "Status",      sortable: false, className: "w-24 hidden md:table-cell" },
  { key: "actions",     label: "",            sortable: false, className: "w-10" },
];

export function TransactionTable({
  transactions,
  sort,
  onSort,
  onSelect,
  onEdit,
  onDelete,
  selectedId,
  isLoading,
}: TransactionTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center border-b border-border bg-muted/30 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
          <div className="w-28"><Skeleton className="h-3 w-16" /></div>
          <div className="min-w-0 flex-1"><Skeleton className="h-3 w-24" /></div>
          <div className="hidden w-36 sm:block"><Skeleton className="h-3 w-16" /></div>
          <div className="w-28"><Skeleton className="h-3 w-16 ml-auto" /></div>
          <div className="hidden w-24 md:block"><Skeleton className="h-3 w-12" /></div>
          <div className="w-10" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center px-4 py-3 gap-3">
              <div className="w-28"><Skeleton className="h-4 w-20" /></div>
              <div className="min-w-0 flex-1 flex items-center gap-2.5">
                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                <div className="min-w-0 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="hidden w-36 shrink-0 sm:block"><Skeleton className="h-5 w-20 rounded-full" /></div>
              <div className="w-28 shrink-0"><Skeleton className="h-4 w-24 ml-auto" /></div>
              <div className="hidden w-24 shrink-0 md:block"><Skeleton className="h-5 w-14 ml-auto" /></div>
              <div className="w-10 shrink-0"><Skeleton className="h-7 w-7 ml-auto" /></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No transactions found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Table header */}
      <div className="flex items-center border-b border-border bg-muted/30 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
        <div className="w-28">
          <button
            type="button"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => onSort("date")}
          >
            Date <SortIcon field="date" sort={sort} />
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => onSort("description")}
          >
            Description <SortIcon field="description" sort={sort} />
          </button>
        </div>
        <div className="hidden w-36 sm:block">
          <button
            type="button"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => onSort("category")}
          >
            Category <SortIcon field="category" sort={sort} />
          </button>
        </div>
        <div className="w-28 text-right">
          <button
            type="button"
            className="flex items-center justify-end gap-1 hover:text-foreground transition-colors ml-auto"
            onClick={() => onSort("amount")}
          >
            Amount <SortIcon field="amount" sort={sort} />
          </button>
        </div>
        <div className="hidden w-24 md:block">Status</div>
        <div className="w-10" />
      </div>

      {/* Virtualized rows */}
      <div
        ref={parentRef}
        className="overflow-y-auto scrollbar-thin"
        style={{ maxHeight: "calc(100vh - 340px)", minHeight: "200px" }}
        role="table"
        aria-label="Transactions table"
      >
        <div
          style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}
        >
          {rowVirtualizer.getVirtualItems().map((vRow) => {
            const tx = transactions[vRow.index];
            const isSelected = tx.id === selectedId;

            return (
              <div
                key={tx.id}
                data-index={vRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${vRow.start}px)`,
                }}
                className={cn(
                  "flex items-center border-b border-border px-4 py-3 transition-colors cursor-pointer",
                  isSelected ? "bg-primary/5" : "hover:bg-muted/30",
                )}
                onClick={() => onSelect(tx.id)}
                role="row"
                aria-selected={isSelected}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onSelect(tx.id)}
              >
                {/* Date */}
                <div className="w-28 shrink-0 text-xs text-muted-foreground">
                  {new Date(tx.date + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </div>

                {/* Description */}
                <div className="min-w-0 flex-1 flex items-center gap-2.5">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback
                      className="text-[10px] font-bold text-white"
                      style={{ backgroundColor: tx.categoryColor }}
                    >
                      {tx.description.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{tx.description}</p>
                    {tx.merchant && tx.merchant !== tx.description && (
                      <p className="truncate text-xs text-muted-foreground">{tx.merchant}</p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="hidden w-36 shrink-0 sm:block">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: tx.categoryColor + "20",
                      color: tx.categoryColor,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: tx.categoryColor }}
                    />
                    {tx.categoryName}
                  </span>
                </div>

                {/* Amount */}
                <div className="w-28 shrink-0 text-right">
                  <span
                    className={cn(
                      "tabular-nums text-sm font-semibold",
                      tx.type === "income" ? "text-emerald-500" : "text-foreground",
                    )}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(tx.amount)}
                  </span>
                </div>

                {/* Status */}
                <div className="hidden w-24 shrink-0 md:block">
                  <Badge variant={STATUS_BADGE[tx.status] ?? "secondary"} className="text-[10px] h-5">
                    {tx.status}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="w-10 shrink-0 flex justify-end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label={`Actions for ${tx.description}`}
                        >
                          <MoreHorizontal size={14} />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => onSelect(tx.id)}>
                        <ExternalLink size={13} className="mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(tx.id)}>
                        <Pencil size={13} className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(tx.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 size={13} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
