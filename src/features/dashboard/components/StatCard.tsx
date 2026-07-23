"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: number;   // percentage e.g. 3.2 means +3.2%
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  suffix?: string;
  animate?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  className,
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative rounded-xl border border-border bg-card p-5 shadow-sm",
        "transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
          <Icon size={18} className={iconColor} aria-hidden />
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>

      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp size={13} className="text-emerald-500" aria-hidden />
          ) : (
            <TrendingDown size={13} className="text-destructive" aria-hidden />
          )}
          <span
            className={cn(
              "text-xs font-semibold",
              isPositive ? "text-emerald-500" : "text-destructive",
            )}
          >
            {isPositive ? "+" : ""}{change.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}
