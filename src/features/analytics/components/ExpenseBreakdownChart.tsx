"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { CategoryBreakdown } from "@/types/analytics";

interface ExpenseBreakdownChartProps {
  data: CategoryBreakdown[];
}

export default function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="categoryName"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={45}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.categoryId} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Amount"]}
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              borderColor: "#334155",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
