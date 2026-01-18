"use client";

import { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      setReady(width > 0 && height > 0);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="min-h-[220px] w-full">
      {ready ? (
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
      ) : (
        <div className="h-[220px] w-full rounded-xl border border-border-color bg-bg-primary/40" />
      )}
    </div>
  );
}
