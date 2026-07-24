"use client";

import { useState } from "react";
import { FileSpreadsheet, Search, Filter, ArrowUpRight, ArrowDownRight, Upload, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LANDING_MOCK_TRANSACTIONS } from "@/lib/mock-landing-data";

export function TransactionsSection() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "expense" | "income">("all");

  const filteredList = LANDING_MOCK_TRANSACTIONS.filter((t) => {
    if (selectedFilter === "income") return t.type === "income";
    if (selectedFilter === "expense") return t.type === "expense";
    return true;
  });

  return (
    <section id="transactions" className="py-20 bg-muted/20 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs gap-1.5 border-primary/40 bg-primary/10 text-primary rounded-full">
            <FileSpreadsheet className="h-3.5 w-3.5" /> High-Performance Transaction Ledger
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Seamless Transaction Tracking & Import
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Filter by income or expense, search instantly, or drag-and-drop bank CSV/XLSX files for automated column mapping.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Transaction Filter Table */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 rounded-lg bg-muted p-1 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setSelectedFilter("all")}
                  className={`px-3 py-1 rounded-md transition-all ${selectedFilter === "all" ? "bg-card text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  All (8)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter("expense")}
                  className={`px-3 py-1 rounded-md transition-all ${selectedFilter === "expense" ? "bg-card text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Expenses (7)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter("income")}
                  className={`px-3 py-1 rounded-md transition-all ${selectedFilter === "income" ? "bg-card text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Income (1)
                </button>
              </div>

              <span className="text-xs text-muted-foreground font-mono">Live Interactive Demo</span>
            </div>

            <Card className="border-border/60 bg-card/90 shadow-xl overflow-hidden backdrop-blur-md">
              <div className="divide-y divide-border/40 text-xs">
                {filteredList.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0"
                        style={{ backgroundColor: t.categoryColor }}
                      >
                        {t.type === "income" ? <ArrowUpRight className="h-4 w-4 text-white" /> : <ArrowDownRight className="h-4 w-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{t.description}</p>
                        <p className="text-muted-foreground text-xs">{t.merchant} • <span className="text-primary font-medium">{t.category}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-extrabold text-sm ${t.type === "income" ? "text-emerald-500" : "text-foreground"}`}>
                        {t.type === "income" ? "+" : "-"}₱{t.amount.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{t.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Statement Import Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/60 bg-card/90 shadow-xl p-6 space-y-5 backdrop-blur-md">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">Bank Statement Importer</h3>
                <p className="text-xs text-muted-foreground mt-1">Upload CSV or XLSX exports from BDO, BPI, UnionBank, GCash, or Maya.</p>
              </div>

              {/* Upload Dropzone Preview */}
              <div className="border-2 border-dashed border-primary/40 rounded-xl bg-primary/5 p-6 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Drag & drop your statement file here</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Supports .csv, .xlsx up to 10MB</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs border-primary/30 text-primary hover:bg-primary/10">
                  Select File
                </Button>
              </div>

              {/* Automated Column Mapping Feature Checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Smart auto-mapping for Date, Amount, Description</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Duplicate transaction detection & skipping</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Automatic merchant category assignment</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
