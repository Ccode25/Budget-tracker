"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";

interface EnrichedTransaction extends Transaction {
  categoryName: string;
  categoryColor: string;
}

interface RecentTransactionsProps {
  transactions: EnrichedTransaction[];
}

function formatAmount(amount: number, type: Transaction["type"]): string {
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
  return type === "income" ? `+${formatted}` : `-${formatted}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Latest activity this month</p>
        </div>
        <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={() => {}}>
          <Link href="/transactions" className="flex items-center gap-1">
            View all <ArrowRight size={12} aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="divide-y divide-border">
        {transactions.map((tx, i) => (
          <motion.div
            key={`${tx.id}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback
                className="text-[11px] font-bold text-white"
                style={{ backgroundColor: tx.categoryColor }}
              >
                {(tx.merchant ?? tx.description).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {tx.description}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: tx.categoryColor }}
                  aria-hidden
                />
                <p className="text-xs text-muted-foreground">
                  {tx.categoryName} · {formatDate(tx.date)}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  tx.type === "income" ? "text-emerald-500" : "text-foreground",
                )}
              >
                {formatAmount(tx.amount, tx.type)}
              </p>
              {tx.status === "pending" && (
                <Badge variant="secondary" className="mt-0.5 h-4 px-1 text-[10px]">
                  pending
                </Badge>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
