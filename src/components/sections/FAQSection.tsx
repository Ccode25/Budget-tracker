"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LANDING_MOCK_FAQS } from "@/lib/mock-landing-data";

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs gap-1.5 border-primary/40 bg-primary/10 text-primary rounded-full font-medium">
            <HelpCircle className="h-3.5 w-3.5" /> Got Questions?
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Everything you need to know about BudgetTracker, date-range budgets, and CSV statement imports.
          </p>
        </div>

        <div className="space-y-3">
          {LANDING_MOCK_FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border/60 bg-card/80 transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-foreground hover:bg-muted/30 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground ${isOpen ? "rotate-180 text-primary" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 bg-muted/20 animate-in fade-in-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
