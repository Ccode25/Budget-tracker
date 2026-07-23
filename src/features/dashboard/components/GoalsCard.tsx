"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Target, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  color: string;
  icon: string;
}

interface GoalsCardProps {
  goals: Goal[];
}

function CircularProgress({
  pct,
  color,
  size = 52,
}: {
  pct: number;
  color: string;
  size?: number;
}) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="currentColor"
        className="text-muted/50"
        strokeWidth={5}
      />
      {/* Progress */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - dash }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%" y="50%"
        dominantBaseline="middle" textAnchor="middle"
        fontSize={10} fill="currentColor"
        className="font-semibold text-foreground"
      >
        {pct}%
      </text>
    </svg>
  );
}

export function GoalsCard({ goals }: GoalsCardProps) {
  const displayed = goals.slice(0, 3);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-primary" aria-hidden />
          <h3 className="text-sm font-semibold text-foreground">Savings Goals</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs">
          <Link href="/goals" className="flex items-center gap-1">
            View all <ArrowRight size={12} aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="divide-y divide-border">
        {displayed.map((goal, i) => {
          const savedVal = typeof goal.saved === "number" ? goal.saved : parseFloat((goal.saved as any) || 0) || 0;
          const targetVal = typeof goal.target === "number" ? goal.target : parseFloat((goal.target as any) || 0) || 0;
          const pct = targetVal > 0 ? Math.round((savedVal / targetVal) * 100) : 0;
          const deadline = goal.deadline
            ? new Date(goal.deadline).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "N/A";

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 px-5 py-4"
            >
              <CircularProgress pct={pct} color={goal.color || "#10b981"} />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{goal.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ₱{savedVal.toLocaleString()} of ₱{targetVal.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Calendar size={10} aria-hidden />
                  <span>By {deadline}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-foreground">
                  ₱{Math.max(0, targetVal - savedVal).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">to go</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
