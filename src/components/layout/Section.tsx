import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  id?: string;
  actions?: React.ReactNode;
}

export function Section({ children, title, subtitle, className, id, actions }: SectionProps) {
  return (
    <section id={id} className={cn("space-y-6", className)} aria-label={title}>
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title && (
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
