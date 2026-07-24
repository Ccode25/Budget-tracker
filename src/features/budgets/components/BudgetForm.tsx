"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Budget, BudgetPeriod } from "@/types/budget";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    period: z.enum(["monthly", "annual", "weekly", "custom"]),
    startDate: z.string().min(1, "Start date required"),
    endDate: z.string().min(1, "End date required"),
    amount: z.number().positive("Budget amount must be positive"),
    color: z.string(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Start date must be before or equal to end date.",
    path: ["startDate"],
  });

type FormValues = z.infer<typeof schema>;

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (budget: Partial<Budget> & { name: string; startDate: string; endDate: string; amount: number }) => Promise<{ success: boolean; error?: string }>;
  budget?: Budget | null;
  onUpdate?: (id: string, updates: Partial<Budget>) => Promise<{ success: boolean; error?: string }>;
}

const COLOR_OPTIONS = ["#7c3aed", "#0ea5e9", "#f59e0b", "#059669", "#ec4899", "#6366f1"];

export function BudgetForm({ open, onOpenChange, onSubmit, budget, onUpdate }: BudgetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      period: "monthly",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      amount: 50000,
      color: "#7c3aed",
    },
  });

  const selectedColor = watch("color");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setErrorMessage(null);
    if (budget) {
      reset({
        name: budget.name,
        period: budget.period || "monthly",
        startDate: budget.startDate,
        endDate: budget.endDate,
        amount: budget.amount ?? budget.totalLimit ?? 50000,
        color: budget.color || "#7c3aed",
      });
    } else {
      reset({
        name: "",
        period: "monthly",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        amount: 50000,
        color: "#7c3aed",
      });
    }
  }, [budget, open, reset]);

  const handleFormSubmit = async (data: FormValues) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      if (budget && onUpdate) {
        const res = await onUpdate(budget.id, {
          name: data.name,
          period: data.period as BudgetPeriod,
          startDate: data.startDate,
          endDate: data.endDate,
          amount: data.amount,
          totalLimit: data.amount,
          color: data.color,
        });
        if (!res.success) {
          setErrorMessage(res.error || "Failed to update budget");
          return;
        }
      } else {
        const res = await onSubmit({
          name: data.name,
          period: data.period as BudgetPeriod,
          startDate: data.startDate,
          endDate: data.endDate,
          amount: data.amount,
          totalLimit: data.amount,
          color: data.color,
          isActive: true,
        });
        if (!res.success) {
          setErrorMessage(res.error || "Failed to create budget");
          return;
        }
      }
      reset();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{budget ? "Edit Budget Period" : "Create Budget Period"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              <AlertCircle size={14} className="shrink-0 mt-0.5" aria-hidden />
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="bgt-name">Budget Name *</Label>
            <Input id="bgt-name" placeholder="e.g. July 2026" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bgt-amount">Budget Amount (₱) *</Label>
              <Input id="bgt-amount" type="number" placeholder="50000" {...register("amount", { valueAsNumber: true })} />
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bgt-period">Period Type</Label>
              <select
                id="bgt-period"
                {...register("period")}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bgt-start">Start Date *</Label>
              <Input id="bgt-start" type="date" {...register("startDate")} />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bgt-end">End Date *</Label>
              <Input id="bgt-end" type="date" {...register("endDate")} />
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Theme Color</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue("color", c)}
                  className={`h-6 w-6 rounded-full border-2 transition-transform ${
                    selectedColor === c ? "scale-110 border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : budget ? "Update Budget" : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}