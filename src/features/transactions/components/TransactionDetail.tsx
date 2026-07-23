"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Pencil, Trash2, Calendar, Tag, FileText, Building2 } from "lucide-react";
import type { EnrichedTransaction } from "../hooks/useTransactions";
import { cn } from "@/lib/utils";

interface TransactionDetailProps {
  transaction: EnrichedTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionDetail({
  transaction,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: TransactionDetailProps) {
  if (!transaction) return null;

  const formattedAmount = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(transaction.amount);

  const formattedDate = new Date(transaction.date + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left space-y-4">
          <div className="flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: transaction.categoryColor + "20",
                color: transaction.categoryColor,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: transaction.categoryColor }}
              />
              {transaction.categoryName}
            </span>
            <Badge
              variant={
                transaction.status === "completed"
                  ? "default"
                  : transaction.status === "pending"
                  ? "secondary"
                  : "destructive"
              }
              className="capitalize"
            >
              {transaction.status}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarFallback
                className="text-sm font-bold text-white"
                style={{ backgroundColor: transaction.categoryColor }}
              >
                {transaction.description.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                {transaction.description}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                ID: {transaction.id}
              </DialogDescription>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Amount
            </span>
            <p
              className={cn(
                "text-3xl font-extrabold tracking-tight mt-0.5",
                transaction.type === "income" ? "text-emerald-500" : "text-foreground"
              )}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formattedAmount}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-sm py-2">
          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>

            {transaction.merchant && (
              <div className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Merchant</p>
                  <p className="font-medium">{transaction.merchant}</p>
                </div>
              </div>
            )}
          </div>

          {transaction.notes && (
            <div className="flex items-start gap-2.5 pt-1">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="font-medium text-foreground">{transaction.notes}</p>
              </div>
            </div>
          )}

          {transaction.tags && transaction.tags.length > 0 && (
            <div className="flex items-start gap-2.5 pt-1">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {transaction.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] py-0">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => {
              onOpenChange(false);
              onEdit(transaction.id);
            }}
          >
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-2"
            onClick={() => {
              onOpenChange(false);
              onDelete(transaction.id);
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
