import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "inline-block rounded-full border-2 animate-spin",
  {
    variants: {
      size: {
        xs: "h-3 w-3 border-[1.5px]",
        sm: "h-4 w-4",
        md: "h-6 w-6 border-[2.5px]",
        lg: "h-8 w-8 border-[3px]",
        xl: "h-12 w-12 border-4",
      },
      variant: {
        default:     "border-primary/25 border-t-primary",
        muted:       "border-muted-foreground/25 border-t-muted-foreground",
        white:       "border-white/25 border-t-white",
        destructive: "border-destructive/25 border-t-destructive",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export function Spinner({ size, variant, label = "Loading…", className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <span className={spinnerVariants({ size, variant })} />
      <span className="sr-only">{label}</span>
    </div>
  );
}
