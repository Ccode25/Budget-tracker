"use client";

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
import type { Category } from "@/types/category";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["income", "expense", "both"]),
  color: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (category: Omit<Category, "id">) => void;
}

const PRESET_COLORS = [
  "#7c3aed", "#059669", "#0ea5e9", "#f59e0b", "#6366f1",
  "#ec4899", "#10b981", "#8b5cf6", "#06b6d4", "#f43f5e"
];

export function CategoryForm({ open, onOpenChange, onSubmit }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "expense",
      color: "#7c3aed",
    },
  });

  const selectedColor = watch("color");

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      name: data.name,
      type: data.type,
      color: data.color,
      icon: "Tag",
      isDefault: false,
      isActive: true,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Category Name</Label>
            <Input id="cat-name" placeholder="e.g. Subscriptions" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-type">Type</Label>
            <select
              id="cat-type"
              {...register("type")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>Color Preset</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue("color", c)}
                  className={`h-7 w-7 rounded-full transition-transform ${
                    selectedColor === c ? "scale-110 ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
