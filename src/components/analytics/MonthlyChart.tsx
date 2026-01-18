"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="dream-card" style={{ padding: "12px 16px" }}>
      <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
        {label}
      </div>
      <div style={{ fontWeight: 600 }}>{payload[0].value}</div>
    </div>
  );
}

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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      ref={containerRef}
      style={{ minHeight: "220px", width: "100%" }}
    >
      {ready ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#3D3B5C" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#B0B3C1", fontSize: 10 }} />
            <YAxis tick={{ fill: "#B0B3C1", fontSize: 10 }} />
            <Tooltip content={<ChartTooltip />} />
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
        <div className="dream-card" style={{ minHeight: "220px" }} />
      )}
    </motion.div>
  );
}
