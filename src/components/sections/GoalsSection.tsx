"use client";

import { Target, ShieldCheck, Plane, Laptop, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LANDING_MOCK_GOALS } from "@/lib/mock-landing-data";
import { signIn } from "next-auth/react";

export function GoalsSection() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <section id="goals" className="py-20 bg-muted/20 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs gap-1.5 border-primary/40 bg-primary/10 text-primary rounded-full font-medium">
            <Target className="h-3.5 w-3.5" /> Financial Goals & Milestones
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Turn Financial Dreams Into Actionable Milestones
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Set target dates, track progress bars, and automate monthly goal deposits effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LANDING_MOCK_GOALS.map((goal) => {
            const percent = Math.round((goal.currentAmount / goal.targetAmount) * 100);
            return (
              <Card key={goal.id} className="border-border/60 bg-card/90 shadow-lg backdrop-blur-md transition-all hover:border-primary/50 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px] font-mono">Target: {goal.targetDate}</Badge>
                    <span className="text-xs font-semibold text-emerald-500">{percent}% Completed</span>
                  </div>
                  <CardTitle className="text-lg font-bold mt-2">{goal.title}</CardTitle>
                  <CardDescription className="text-xs">{goal.category} Savings Plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-foreground">₱{goal.currentAmount.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Goal: ₱{goal.targetAmount.toLocaleString()}</span>
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> On Track</span>
                    <span>₱{(goal.targetAmount - goal.currentAmount).toLocaleString()} Remaining</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button onClick={handleGoogleLogin} size="lg" className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:opacity-90">
            Start Your First Savings Goal <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
