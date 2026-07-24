"use client";

import { Star, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LANDING_MOCK_TESTIMONIALS } from "@/lib/mock-landing-data";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-muted/20 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs gap-1.5 border-amber-500/40 bg-amber-500/10 text-amber-400 rounded-full font-medium">
            <MessageSquare className="h-3.5 w-3.5" /> Loved by Modern Savers
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            What Our Users Say
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Read how professionals, freelancers, and designers stay on top of their budgets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LANDING_MOCK_TESTIMONIALS.map((t, idx) => (
            <Card key={idx} className="border-border/60 bg-card/80 p-6 flex flex-col justify-between backdrop-blur-sm shadow-md">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
                  "{t.quote}"
                </p>
              </CardContent>
              <div className="flex items-center gap-3 pt-6 border-t border-border/40 mt-4">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="h-10 w-10 rounded-full object-cover border border-border"
                />
                <div>
                  <h4 className="text-xs font-bold text-foreground">{t.author}</h4>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
