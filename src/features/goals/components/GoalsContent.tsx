"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Plus,
  Shield,
  Car,
  Plane,
  Home,
  PiggyBank,
  TrendingUp,
  Calendar,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SAVINGS_GOALS } from "@/features/analytics/mock/analytics";
import { cn } from "@/lib/utils";

export interface GoalItem {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  color: string;
  icon: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  Car,
  Plane,
  Home,
  PiggyBank,
  Target,
};

const COLOR_OPTIONS = [
  "#7c3aed", // Violet
  "#0ea5e9", // Sky blue
  "#f59e0b", // Amber
  "#059669", // Emerald
  "#ec4899", // Pink
  "#6366f1", // Indigo
];

export function GoalsContent() {
  const [goals, setGoals] = useState<GoalItem[]>(SAVINGS_GOALS);
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formSaved, setFormSaved] = useState("");
  const [formDeadline, setFormDeadline] = useState("");
  const [formColor, setFormColor] = useState(COLOR_OPTIONS[0]);
  const [formIcon, setFormIcon] = useState("Target");

  // Contribution state
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  // Stats
  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.saved, 0);
  const overallPercentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const completedCount = goals.filter((g) => g.saved >= g.target).length;

  const filteredGoals = goals.filter((g) => {
    if (filter === "completed") return g.saved >= g.target;
    if (filter === "in-progress") return g.saved < g.target;
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingGoal(null);
    setFormName("");
    setFormTarget("");
    setFormSaved("0");
    setFormDeadline(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setFormColor(COLOR_OPTIONS[0]);
    setFormIcon("Target");
    setModalOpen(true);
  };

  const handleOpenEditModal = (goal: GoalItem) => {
    setEditingGoal(goal);
    setFormName(goal.name);
    setFormTarget(goal.target.toString());
    setFormSaved(goal.saved.toString());
    setFormDeadline(goal.deadline);
    setFormColor(goal.color);
    setFormIcon(goal.icon);
    setModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formTarget) return;

    const targetNum = parseFloat(formTarget) || 0;
    const savedNum = parseFloat(formSaved) || 0;

    if (editingGoal) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoal.id
            ? {
                ...g,
                name: formName,
                target: targetNum,
                saved: savedNum,
                deadline: formDeadline,
                color: formColor,
                icon: formIcon,
              }
            : g
        )
      );
    } else {
      const newGoal: GoalItem = {
        id: `goal-${Date.now()}`,
        name: formName,
        target: targetNum,
        saved: savedNum,
        deadline: formDeadline,
        color: formColor,
        icon: formIcon,
      };
      setGoals((prev) => [newGoal, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAddDeposit = (id: string) => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;

    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, saved: Math.min(g.target, g.saved + amt) } : g
      )
    );
    setDepositGoalId(null);
    setDepositAmount("");
  };

  return (
    <PageWrapper>
      <Container className="py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Savings Goals
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Set milestones, track savings progress, and reach your targets.
            </p>
          </div>
          <Button size="sm" className="gap-2 shrink-0" onClick={handleOpenAddModal}>
            <Plus size={16} aria-hidden /> Add New Goal
          </Button>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">Total Target</span>
              <Target size={16} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">₱{totalTarget.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{goals.length} total active targets</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">Total Saved</span>
              <PiggyBank size={16} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">₱{totalSaved.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-medium">{overallPercentage}% of overall target</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">Remaining</span>
              <TrendingUp size={16} className="text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">₱{Math.max(0, totalTarget - totalSaved).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">To reach all financial goals</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">Completed</span>
              <CheckCircle2 size={16} className="text-violet-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{completedCount} Goals</p>
            <p className="text-xs text-muted-foreground">{goals.length - completedCount} in progress</p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-lg border border-border/50 text-xs">
            {(["all", "in-progress", "completed"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-3 py-1 rounded-md font-medium capitalize transition-colors",
                  filter === tab
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.replace("-", " ")}
              </button>
            ))}
          </div>

          <span className="text-xs text-muted-foreground">
            Showing {filteredGoals.length} of {goals.length} goals
          </span>
        </div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center space-y-3">
            <Sparkles size={32} className="mx-auto text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">No goals found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {filter === "completed"
                ? "You haven't completed any goals yet. Keep saving!"
                : "Create a new goal to start tracking your savings milestones."}
            </p>
            <Button size="sm" onClick={handleOpenAddModal} className="gap-2">
              <Plus size={14} /> Create a Goal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGoals.map((goal) => {
              const IconComp = ICON_MAP[goal.icon] || Target;
              const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
              const remaining = Math.max(0, goal.target - goal.saved);
              const isCompleted = goal.saved >= goal.target;
              const isDepositActive = depositGoalId === goal.id;

              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-all hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-xs"
                          style={{ backgroundColor: goal.color }}
                        >
                          <IconComp size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base text-foreground leading-tight">
                            {goal.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <Calendar size={11} />
                            <span>Target: {new Date(goal.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Menu */}
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(goal)}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit Goal"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete Goal"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-foreground">
                          ₱{goal.saved.toLocaleString()}{" "}
                          <span className="font-normal text-muted-foreground">of ₱{goal.target.toLocaleString()}</span>
                        </span>
                        <span className={cn("font-bold", isCompleted ? "text-emerald-600 font-extrabold" : "text-foreground")}>
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: isCompleted ? "#059669" : goal.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer / Quick Deposit */}
                  <div className="mt-4 pt-3 border-t border-border/60">
                    {isCompleted ? (
                      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 py-1.5 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 size={14} /> Target Achieved!
                      </div>
                    ) : isDepositActive ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Amount (₱)"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="h-8 flex-1 rounded-md border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          autoFocus
                        />
                        <Button size="sm" className="h-8 px-2.5 text-xs" onClick={() => handleAddDeposit(goal.id)}>
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => {
                            setDepositGoalId(null);
                            setDepositAmount("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          <strong className="text-foreground font-semibold">₱{remaining.toLocaleString()}</strong> to go
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => {
                            setDepositGoalId(goal.id);
                            setDepositAmount("");
                          }}
                        >
                          <Plus size={12} /> Add Deposit
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Create / Edit Goal Modal */}
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-bold text-lg text-foreground">
                    {editingGoal ? "Edit Savings Goal" : "Create Savings Goal"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="p-1 rounded-md hover:bg-muted text-muted-foreground"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSaveGoal} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Goal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Emergency Fund, New Laptop"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Target Amount (₱) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="e.g. 50000"
                        value={formTarget}
                        onChange={(e) => setFormTarget(e.target.value)}
                        className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Already Saved (₱)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formSaved}
                        onChange={(e) => setFormSaved(e.target.value)}
                        className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={formDeadline}
                      onChange={(e) => setFormDeadline(e.target.value)}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  {/* Icon & Color Selection */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Icon
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.keys(ICON_MAP).map((iconKey) => {
                          const IconC = ICON_MAP[iconKey];
                          return (
                            <button
                              key={iconKey}
                              type="button"
                              onClick={() => setFormIcon(iconKey)}
                              className={cn(
                                "p-2 rounded-md border transition-colors",
                                formIcon === iconKey
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border text-muted-foreground hover:bg-muted"
                              )}
                            >
                              <IconC size={14} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Theme Color
                      </label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {COLOR_OPTIONS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setFormColor(c)}
                            className={cn(
                              "h-6 w-6 rounded-full border-2 transition-transform",
                              formColor === c ? "scale-110 border-foreground" : "border-transparent"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                    <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" type="submit">
                      {editingGoal ? "Update Goal" : "Create Goal"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </PageWrapper>
  );
}
