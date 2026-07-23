"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  period: z.enum(["monthly", "annual", "weekly", "custom"]),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  totalLimit: z.number().positive("Limit must be positive"),
  color: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (budget: Omit<Budget, "id">) => void;
  budget?: Budget | null;
  onUpdate?: (id: string, updates: Partial<Budget>) => void;
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
      totalLimit: 10000,
      color: "#7c3aed",
    },
  });

  const selectedColor = watch("color");

  useEffect(() => {
    if (budget) {
      reset({
        name: budget.name,
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        totalLimit: budget.totalLimit,
        color: budget.color || "#7c3aed",
      });
    } else {
      reset({
        name: "",
        period: "monthly",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        totalLimit: 10000,
        color: "#7c3aed",
      });
    }
  }, [budget, open, reset]);

  const handleFormSubmit = (data: FormValues) => {
    if (budget && onUpdate) {
      onUpdate(budget.id, {
        name: data.name,
        period: data.period as BudgetPeriod,
        startDate: data.startDate,
        endDate: data.endDate,
        totalLimit: data.totalLimit,
        color: data.color,
      });
    } else {
      onSubmit({
        name: data.name,
        period: data.period as BudgetPeriod,
        startDate: data.startDate,
        endDate: data.endDate,
        totalLimit: data.totalLimit,
        totalSpent: 0,
        color: data.color,
        isActive: true,
        categories: [
          { categoryId: "cat-housing", limit: data.totalLimit * 0.4, spent: 0 },
          { categoryId: "cat-food", limit: data.totalLimit * 0.3, spent: 0 },
          { categoryId: "cat-transport", limit: data.totalLimit * 0.3, spent: 0 },
        ],
      });
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{budget ? "Edit Budget Plan" : "Create Budget Plan"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bgt-name">Budget Name *</Label>
            <Input id="bgt-name" placeholder="e.g. Monthly Living, Vacation Budget" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bgt-period">Period</Label>
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
            <div className="space-y-1.5">
              <Label htmlFor="bgt-limit">Limit Amount (₱) *</Label>
              <Input id="bgt-limit" type="number" placeholder="10000" {...register("totalLimit", { valueAsNumber: true })} />
              {errors.totalLimit && (
                <p className="text-xs text-destructive">{errors.totalLimit.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bgt-start">Start Date</Label>
              <Input id="bgt-start" type="date" {...register("startDate")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bgt-end">End Date</Label>
              <Input id="bgt-end" type="date" {...register("endDate")} />
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
            <Button type="submit">{budget ? "Update Budget" : "Create Budget"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
