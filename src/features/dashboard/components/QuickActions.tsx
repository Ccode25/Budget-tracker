"use client";

import Link from "next/link";
import { Plus, Upload, PiggyBank, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ACTIONS = [
  {
    label: "Add Transaction",
    description: "Log new income or expense",
    href: "/transactions",
    icon: Plus,
    color: "text-primary",
    bg: "bg-primary/10 hover:bg-primary/20",
    border: "border-primary/20",
  },
  {
    label: "Import File",
    description: "Upload CSV or Excel statement",
    href: "/transactions/import",
    icon: Upload,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
    border: "border-emerald-500/20",
  },
  {
    label: "New Budget",
    description: "Set a spending limit",
    href: "/budget",
    icon: PiggyBank,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 hover:bg-amber-500/20",
    border: "border-amber-500/20",
  },
  {
    label: "Analytics",
    description: "View spending trends",
    href: "/analytics",
    icon: BarChart3,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10 hover:bg-violet-500/20",
    border: "border-violet-500/20",
  },
] as const;

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ACTIONS.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={action.href}
              className={cn(
                "flex flex-col items-center gap-2.5 rounded-xl border p-4 text-center",
                "transition-all duration-150",
                action.bg,
                action.border,
                "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
              )}
              aria-label={action.label}
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", action.bg)}>
                <action.icon size={20} className={action.color} aria-hidden />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{action.label}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
