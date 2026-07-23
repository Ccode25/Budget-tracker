import type { Metadata } from "next";
import { Plus, Target, Home, Car, Plane } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Goals",
  description: "Track your savings goals and financial milestones.",
};

const goals = [
  {
    label:    "Emergency Fund",
    icon:     Home,
    saved:    8500,
    target:   10000,
    deadline: "Dec 2026",
    status:   "On Track",
    color:    "text-chart-1",
    bgColor:  "bg-chart-1/10",
  },
  {
    label:    "New Car",
    icon:     Car,
    saved:    3200,
    target:   25000,
    deadline: "Jun 2028",
    status:   "On Track",
    color:    "text-chart-2",
    bgColor:  "bg-chart-2/10",
  },
  {
    label:    "Europe Trip",
    icon:     Plane,
    saved:    1800,
    target:   5000,
    deadline: "May 2027",
    status:   "Needs Attention",
    color:    "text-chart-3",
    bgColor:  "bg-chart-3/10",
  },
];

export default function GoalsPage() {
  return (
    <PageWrapper>
      <Container className="py-6 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Goals</h2>
            <p className="text-sm text-muted-foreground mt-1">Your savings milestones and progress.</p>
          </div>
          <Button className="shrink-0 gap-2">
            <Plus size={14} aria-hidden /> New Goal
          </Button>
        </div>

        {/* Active Goals */}
        <Section title="Active Goals" subtitle={`${goals.length} goals in progress`}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const pct = Math.round((goal.saved / goal.target) * 100);
              const needsAttention = goal.status === "Needs Attention";
              return (
                <Card
                  key={goal.label}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  tabIndex={0}
                  role="button"
                  aria-label={`${goal.label}: ${pct}% saved`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${goal.bgColor}`}>
                          <goal.icon size={18} className={goal.color} aria-hidden />
                        </div>
                        <CardTitle className="text-sm font-semibold leading-tight">{goal.label}</CardTitle>
                      </div>
                      <Badge variant={needsAttention ? "destructive" : "secondary"} className="text-[10px] shrink-0">
                        {goal.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold">₱{goal.saved.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">of ₱{goal.target.toLocaleString()} goal</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{pct}%</p>
                        <p className="text-xs text-muted-foreground">complete</p>
                      </div>
                    </div>
                    <Progress
                      value={pct}
                      className="h-2"
                      aria-label={`${goal.label}: ${pct}% complete`}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>₱{(goal.target - goal.saved).toLocaleString()} remaining</span>
                      <span>By {goal.deadline}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* New Goal CTA Card */}
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
              <CardContent className="flex h-full flex-col items-center justify-center gap-3 py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Plus size={20} className="text-primary" aria-hidden />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Add a New Goal</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Start saving towards something new</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Completed Goals */}
        <Section title="Completed" subtitle="Goals you&apos;ve achieved">
          <EmptyState
            icon={Target}
            title="No completed goals yet"
            description="Keep working towards your goals. Your completed milestones will appear here."
          />
        </Section>
      </Container>
    </PageWrapper>
  );
}
