"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type MonthlyChartProps = {
  data: { date: string; count: number }[];
};

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fill: "#B0B3C1", fontSize: 10 }} />
          <YAxis tick={{ fill: "#B0B3C1", fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              background: "#1E1B4B",
              border: "1px solid #3D3B5C",
              color: "#E2E8F0",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#A78BFA"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
