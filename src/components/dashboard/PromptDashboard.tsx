"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  createPrompt,
  deletePrompt,
  listPrompts,
  toggleFavorite,
  togglePublic,
  updatePrompt,
  type PromptListItem,
} from "@/actions/prompts";
import { PromptCard } from "@/components/dashboard/PromptCard";
import { PromptDialog, type PromptFormValues } from "@/components/dashboard/PromptDialog";

type PromptDashboardProps = {
  mode: "mine" | "public" | "favorites";
};

const pageSize = 10;

export function PromptDashboard({ mode }: PromptDashboardProps) {
  const [items, setItems] = useState<PromptListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [currentUserId, setCurrentUserId] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PromptListItem | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, mode]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listPrompts({ mode, page, pageSize, query: debouncedQuery })
      .then((result) => {
        if (!active) return;
        setItems(result.items);
        setTotal(result.total);
        setCurrentUserId(result.currentUserId);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [mode, page, debouncedQuery]);

  const header = useMemo(() => {
    if (mode === "public") {
      return { title: "Личный кабинет", subtitle: "Публичные сны" };
    }
    if (mode === "favorites") {
      return { title: "Личный кабинет", subtitle: "Избранные сны" };
    }
    return { title: "Личный кабинет", subtitle: "Мои сны" };
  }, [mode]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (prompt: PromptListItem) => {
    setEditing(prompt);
    setDialogOpen(true);
  };

  const handleSubmit = (values: PromptFormValues) => {
    startTransition(async () => {
      if (editing) {
        await updatePrompt(editing.id, values);
      } else {
        await createPrompt(values);
      }
      setDialogOpen(false);
      setEditing(null);
      const result = await listPrompts({ mode, page: 1, pageSize, query: debouncedQuery });
      setItems(result.items);
      setTotal(result.total);
      setCurrentUserId(result.currentUserId);
      setPage(1);
    });
  };

  const handleDelete = (prompt: PromptListItem) => {
    if (!confirm("Удалить сон?")) return;
    startTransition(async () => {
      await deletePrompt(prompt.id);
      const result = await listPrompts({ mode, page, pageSize, query: debouncedQuery });
      setItems(result.items);
      setTotal(result.total);
      setCurrentUserId(result.currentUserId);
    });
  };

  const handleTogglePublic = (prompt: PromptListItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === prompt.id ? { ...item, isPublic: !item.isPublic } : item
      )
    );
    startTransition(async () => {
      await togglePublic(prompt.id);
      const result = await listPrompts({ mode, page, pageSize, query: debouncedQuery });
      setItems(result.items);
      setTotal(result.total);
      setCurrentUserId(result.currentUserId);
    });
  };

  const handleToggleFavorite = (prompt: PromptListItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === prompt.id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
    startTransition(async () => {
      await toggleFavorite(prompt.id);
      const result = await listPrompts({ mode, page, pageSize, query: debouncedQuery });
      setItems(result.items);
      setTotal(result.total);
      setCurrentUserId(result.currentUserId);
    });
  };

  const emptyMessage =
    mode === "public"
      ? "Публичных снов пока нет."
      : mode === "favorites"
        ? "В избранном пока пусто."
        : "У вас пока нет снов — запишите первый.";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="section-header">
        <h1 className="section-title">{header.title}</h1>
        <p className="section-subtitle">{header.subtitle}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <input
          className="form-input"
          placeholder="Поиск по названию или тексту"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ maxWidth: "320px" }}
        />
        {mode === "mine" ? (
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            + Записать сон
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="dream-card">Загрузка...</div>
      ) : items.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.map((prompt) => {
            const canEdit = prompt.userId === currentUserId && mode !== "public";
            const canEditPublic = prompt.userId === currentUserId && mode === "public";
            const allowActions = canEdit || canEditPublic;

            return (
              <PromptCard
                key={prompt.id}
                title={prompt.title}
                content={prompt.content}
                isPublic={prompt.isPublic}
                isFavorite={prompt.isFavorite}
                canEdit={allowActions}
                onEdit={() => openEdit(prompt)}
                onDelete={() => handleDelete(prompt)}
                onTogglePublic={() => handleTogglePublic(prompt)}
                onToggleFavorite={() => handleToggleFavorite(prompt)}
              />
            );
          })}
        </div>
      ) : (
        <div className="dream-card">{emptyMessage}</div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1 || loading}
        >
          Назад
        </button>
        <span className="dream-description">
          Страница {page} из {totalPages}
        </span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages || loading}
        >
          Вперёд
        </button>
        {isPending ? <span className="dream-description">Сохраняем...</span> : null}
      </div>

      <PromptDialog
        open={dialogOpen}
        title={editing ? "Редактировать сон" : "Новый сон"}
        initialValues={
          editing
            ? { title: editing.title, content: editing.content, isPublic: editing.isPublic }
            : undefined
        }
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </div>
  );
}
