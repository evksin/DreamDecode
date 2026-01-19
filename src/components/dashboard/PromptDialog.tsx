"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export type PromptFormValues = {
  title: string;
  content: string;
  isPublic: boolean;
};

type PromptDialogProps = {
  open: boolean;
  title: string;
  initialValues?: PromptFormValues;
  onClose: () => void;
  onSubmit: (values: PromptFormValues) => void;
  isSubmitting?: boolean;
};

const defaultValues: PromptFormValues = {
  title: "",
  content: "",
  isPublic: false,
};

export function PromptDialog({
  open,
  title,
  initialValues,
  onClose,
  onSubmit,
  isSubmitting,
}: PromptDialogProps) {
  const [values, setValues] = useState<PromptFormValues>(defaultValues);

  useEffect(() => {
    if (open) {
      setValues(initialValues ?? defaultValues);
    }
  }, [open, initialValues]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        className="dream-card"
        style={{ width: "100%", maxWidth: "560px" }}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="dream-title" style={{ marginBottom: "12px" }}>
          {title}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span className="dream-description">Название</span>
            <Input
              value={values.title}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Введите название сна"
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span className="dream-description">Текст</span>
            <Textarea
              value={values.content}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, content: event.target.value }))
              }
              placeholder="Опишите сон"
              rows={6}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={values.isPublic}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, isPublic: event.target.checked }))
              }
            />
            <span className="dream-description">Сделать сон публичным</span>
          </label>
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onSubmit(values)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Сохраняем..." : "Сохранить"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
