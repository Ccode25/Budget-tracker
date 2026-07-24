import type { Metadata } from "next";
import { GoalsContent } from "@/features/goals/components/GoalsContent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { goalRepository } from "@/repositories/goal.repository";
import type { GoalItem } from "@/features/goals/components/GoalsContent";

export const metadata: Metadata = {
  title: "Savings Goals — BudgetTracker",
  description: "Track and achieve your savings targets.",
};

export default async function GoalsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id || session?.user?.email;

  let initialGoals: GoalItem[] = [];

  if (userId) {
    const goals = await goalRepository.findAll(userId);
    initialGoals = goals.map((g) => ({
      id: g.id,
      name: g.name,
      target: parseFloat((g.targetAmount ?? 0).toString()),
      saved: parseFloat((g.savedAmount ?? 0).toString()),
      deadline: g.deadline,
      color: g.color || "#7c3aed",
      icon: g.icon || "Target",
    }));
  }

  return <GoalsContent initialGoals={initialGoals} />;
}
