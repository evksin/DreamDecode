"use client";

import { useRouter } from "next/navigation";
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
    <div
      role="button"
      tabIndex={0}
      className="dream-card"
      onClick={() => router.push(`/dream/${dream.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          router.push(`/dream/${dream.id}`);
        }
      }}
    >
      <div className="dream-card-header">
        <span className="dream-emotion">
          {emotionIcons[dream.emotion ?? ""] ?? "🌌"}
        </span>
        <span className="dream-date">
          {dateValue.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "short",
          })}
        </span>
      </div>
      <h3 className="dream-title">{dream.title}</h3>
      <p className="dream-description">{dream.description}</p>
      <div className="dream-clarity">
        {Array.from({ length: clarityStars }).map((_, index) => (
          <span key={`${dream.id}-star-${index}`} className="star">
            ⭐
          </span>
        ))}
      </div>
    </div>
  );
}
