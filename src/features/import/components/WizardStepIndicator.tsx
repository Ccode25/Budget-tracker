"use client";

import { ImportStep } from "@/types/import";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardStepIndicatorProps {
  currentStep: ImportStep;
}

const STEPS: Array<{ id: ImportStep; label: string }> = [
  { id: "upload", label: "Upload" },
  { id: "validate", label: "Validate" },
  { id: "map", label: "Map Columns" },
  { id: "preview", label: "Preview" },
  { id: "categorize", label: "Categorize" },
  { id: "review", label: "Duplicates" },
  { id: "complete", label: "Complete" },
];

export function WizardStepIndicator({ currentStep }: WizardStepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full py-4 border-b border-border bg-muted/20 px-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto overflow-x-auto no-scrollbar gap-2">
        {STEPS.map((step, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div key={step.id} className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  isDone
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/20 ring-offset-2"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:inline-block",
                  isCurrent ? "text-foreground font-semibold" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-4 sm:w-8 transition-colors",
                    i < currentIndex ? "bg-emerald-500" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
