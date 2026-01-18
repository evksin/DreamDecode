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
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        role="button"
        tabIndex={0}
        className="relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden border border-border-dream/40 bg-bg-dream-700/50 p-6 backdrop-blur-md transition-all duration-300 hover:border-accent-purple/60 hover:shadow-dream-lg"
        onClick={() => router.push(`/dream/${dream.id}`)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            router.push(`/dream/${dream.id}`);
          }
        }}
      >
        <div className="flex items-start justify-between">
          <span className="text-3xl">
            {emotionIcons[dream.emotion ?? ""] ?? "🌌"}
          </span>
          <span className="rounded-md bg-accent-purple/10 px-2 py-1 text-[11px] text-text-dream-400">
            {dateValue.toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        </div>
        <div className="text-lg font-semibold text-text-dream-50">
          {dream.title}
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-text-dream-400">
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
