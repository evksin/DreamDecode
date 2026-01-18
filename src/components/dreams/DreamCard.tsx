"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import type { DreamListItem } from "@/types";

const emotionIcons: Record<string, string> = {
  Радость: "😊",
  Страх: "🫣",
  Полёт: "🕊️",
  Спокойствие: "🌙",
  Тревога: "⚡",
  Любопытство: "✨",
};

type DreamCardProps = {
  dream: DreamListItem;
};

export function DreamCard({ dream }: DreamCardProps) {
  const dateValue =
    typeof dream.dreamDate === "string"
      ? new Date(dream.dreamDate)
      : dream.dreamDate;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/dream/${dream.id}`}>
        <Card className="flex h-full flex-col gap-3 hover:border-accent-primary/60">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>
              {dateValue.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "short",
              })}
            </span>
            <span>{emotionIcons[dream.emotion ?? ""] ?? "🌌"}</span>
          </div>
          <div className="text-base font-semibold">{dream.title}</div>
          <p className="line-clamp-3 text-sm text-text-secondary">
            {dream.description}
          </p>
        </Card>
      </Link>
    </motion.div>
  );
}
