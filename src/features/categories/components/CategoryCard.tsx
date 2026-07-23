"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
  onEdit?: () => void;
}

export function CategoryCard({ category, onEdit }: CategoryCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md border-border"
      onClick={onEdit}
    >
      <CardContent className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: category.color }}
          >
            {category.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{category.name}</p>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">
              {category.type} category
            </p>
          </div>
        </div>

        <Badge variant={category.isDefault ? "secondary" : "outline"} className="text-[10px]">
          {category.isDefault ? "Default" : "Custom"}
        </Badge>
      </CardContent>
    </Card>
  );
}
