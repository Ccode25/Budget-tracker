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
import { MOCK_CATEGORIES } from "@/features/categories/mock/categories";
import type { Transaction } from "@/types/transaction";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required").max(100),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense", "transfer"]),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["completed", "pending", "failed"]),
  notes: z.string().max(250).optional(),
});

type FormValues = z.infer<typeof schema>;

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  transaction?: Transaction | null;
  onSubmit: (data: Omit<Transaction, "id">) => void;
}

export function TransactionForm({
  open,
  onOpenChange,
  transaction,
  onSubmit,
}: TransactionFormProps) {
  const isEditing = !!transaction;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      type: "expense",
      status: "completed",
      categoryId: "cat-food",
    },
  });

  const selectedType = watch("type");

  // Populate when editing
  useEffect(() => {
    if (transaction) {
      reset({
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        categoryId: transaction.categoryId,
        status: transaction.status,
        notes: transaction.notes ?? "",
      });
    } else {
      reset({
        date: new Date().toISOString().slice(0, 10),
        type: "expense",
        status: "completed",
        categoryId: "cat-food",
        description: "",
        notes: "",
      });
    }
  }, [transaction, reset, open]);

  const filteredCategories = MOCK_CATEGORIES.filter(
    (c) => c.type === selectedType || c.type === "both",
  );

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      date: data.date,
      description: data.description,
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      status: data.status,
      notes: data.notes,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          {/* Type */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-type">Type</Label>
            <div className="flex gap-2">
              {(["expense", "income", "transfer"] as const).map((t) => (
                <label key={t} className="flex-1 cursor-pointer">
                  <input {...register("type")} type="radio" value={t} className="sr-only" />
                  <span
                    className={`flex items-center justify-center rounded-lg border py-2 text-xs font-medium capitalize transition-colors ${
                      selectedType === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tx-date">Date</Label>
              <Input
                id="tx-date"
                type="date"
                {...register("date")}
                aria-invalid={!!errors.date}
              />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tx-amount">Amount (₱)</Label>
              <Input
                id="tx-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
                aria-invalid={!!errors.amount}
              />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-desc">Description</Label>
            <Input
              id="tx-desc"
              placeholder="e.g. Whole Foods Market"
              {...register("description")}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-category">Category</Label>
            <select
              id="tx-category"
              {...register("categoryId")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={!!errors.categoryId}
            >
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-status">Status</Label>
            <select
              id="tx-status"
              {...register("status")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-notes">Notes (optional)</Label>
            <textarea
              id="tx-notes"
              rows={2}
              placeholder="Any additional notes…"
              {...register("notes")}
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? "Save Changes" : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
