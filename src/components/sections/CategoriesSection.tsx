"use client";

import { Tag, Utensils, Zap, Car, Tv, ShoppingBag, HeartPulse } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LANDING_MOCK_CATEGORIES } from "@/lib/mock-landing-data";

const iconMap: Record<string, any> = {
  Utensils,
  Zap,
  Car,
  Tv,
  ShoppingBag,
  HeartPulse,
};

export function CategoriesSection() {
  return (
    <section id="categories" className="py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs gap-1.5 border-amber-500/40 bg-amber-500/10 text-amber-400 rounded-full font-medium">
            <Tag className="h-3.5 w-3.5" /> Granular Category Management
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Custom Category Badges & Color Tagging
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Organize every transaction with custom hex colors, Lucide iconography, and individual spending limits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LANDING_MOCK_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Tag;
            const percent = Math.round((cat.spent / cat.budgetLimit) * 100);
            return (
              <Card key={cat.id} className="border-border/60 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">{cat.name}</CardTitle>
                      <CardDescription className="text-xs">{cat.transactionCount} transactions logged</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs font-mono">{percent}%</Badge>
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground font-medium">
                    <span>₱{cat.spent.toLocaleString()} spent</span>
                    <span>Cap: ₱{cat.budgetLimit.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: cat.color }} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
