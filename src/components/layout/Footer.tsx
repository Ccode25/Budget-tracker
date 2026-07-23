import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "hidden md:flex items-center justify-between",
        "px-6 py-3 border-t border-border",
        "text-xs text-muted-foreground",
        className,
      )}
    >
      <span>© {year} BudgetTracker. All rights reserved.</span>
      <div className="flex items-center gap-4">
        <a
          href="#"
          className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring"
        >
          Privacy
        </a>
        <a
          href="#"
          className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring"
        >
          Terms
        </a>
        <span className="text-muted-foreground/50">v0.1.0</span>
      </div>
    </footer>
  );
}
