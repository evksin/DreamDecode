"use client";

import {
  Globe,
  Lock,
  MessageSquare,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

type PromptCardProps = {
  title: string;
  content: string;
  isPublic: boolean;
  isFavorite: boolean;
  canEdit: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublic?: () => void;
  onToggleFavorite?: () => void;
};

export function PromptCard({
  title,
  content,
  isPublic,
  isFavorite,
  canEdit,
  onEdit,
  onDelete,
  onTogglePublic,
  onToggleFavorite,
}: PromptCardProps) {
  return (
    <div className="dream-card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <div
        aria-hidden="true"
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "10px",
          background: "rgba(124, 58, 237, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-primary)",
        }}
      >
        <MessageSquare size={18} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="dream-title" style={{ marginBottom: "4px" }}>
          {title}
        </div>
        <div
          className="dream-description"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
          }}
        >
          {content}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {canEdit ? (
          <button
            type="button"
            aria-label={isFavorite ? "Убрать из избранного" : "В избранное"}
            onClick={onToggleFavorite}
            style={{
              background: "transparent",
              border: "none",
              color: isFavorite ? "#f59e0b" : "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <Star size={18} fill={isFavorite ? "#f59e0b" : "none"} />
          </button>
        ) : null}
        {canEdit ? (
          <button
            type="button"
            aria-label={isPublic ? "Сделать приватным" : "Сделать публичным"}
            onClick={onTogglePublic}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            {isPublic ? <Globe size={18} /> : <Lock size={18} />}
          </button>
        ) : null}
        {canEdit ? (
          <button
            type="button"
            aria-label="Редактировать"
            onClick={onEdit}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <Pencil size={18} />
          </button>
        ) : null}
        {canEdit ? (
          <button
            type="button"
            aria-label="Удалить"
            onClick={onDelete}
            style={{
              background: "transparent",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
            }}
          >
            <Trash2 size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
