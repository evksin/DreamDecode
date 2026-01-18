"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { Card } from "@/components/ui/Card";
import type { DreamListItem } from "@/types";

const emotionIcons: Record<string, string> = {
  Радость: "😍",
  Страх: "😨",
  Полёт: "🚀",
  Спокойствие: "😌",
  Тревога: "😰",
  Любопытство: "😊",
};

type DreamCardProps = {
  dream: DreamListItem;
};

export function DreamCard({ dream }: DreamCardProps) {
  const router = useRouter();
  const dateValue =
    typeof dream.dreamDate === "string"
      ? new Date(dream.dreamDate)
      : dream.dreamDate;
  const clarityStars = Math.max(1, Math.round((dream.clarity ?? 5) / 2));
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        role="button"
        tabIndex={0}
        className="flex h-full cursor-pointer flex-col gap-3 border border-border-dream bg-bg-dream-800/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-accent-purple hover:shadow-xl"
        onClick={() => router.push(`/dream/${dream.id}`)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            router.push(`/dream/${dream.id}`);
          }
        }}
      >
        <div className="flex items-center justify-between text-xs text-text-dream-400">
          <span>
            {dateValue.toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "short",
            })}
          </span>
          <span className="text-lg">{emotionIcons[dream.emotion ?? ""] ?? "🌌"}</span>
        </div>
        <div className="text-xl font-semibold text-text-dream-50">
          {dream.title}
        </div>
        <p className="line-clamp-2 text-sm text-text-dream-400">
          {dream.description}
        </p>
        <div className="flex items-center gap-1 text-accent-purple">
          {Array.from({ length: clarityStars }).map((_, index) => (
            <FaStar key={`${dream.id}-star-${index}`} className="text-sm" />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
