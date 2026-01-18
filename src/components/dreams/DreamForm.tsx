"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Slider } from "@/components/ui/Slider";
import type { AnalysisResult, DreamInput, EmotionType } from "@/types";
import { createDreamAction } from "@/actions/dreams";

const emotions: Array<{ value: EmotionType; label: string }> = [
  { value: "Радость", label: "Радость 😊" },
  { value: "Страх", label: "Страх 😨" },
  { value: "Полёт", label: "Полёт 🚀" },
  { value: "Спокойствие", label: "Спокойствие 😌" },
  { value: "Тревога", label: "Тревога 😰" },
  { value: "Любопытство", label: "Любопытство 🤔" },
];

export function DreamForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emotion, setEmotion] = useState<EmotionType | undefined>();
  const [clarity, setClarity] = useState(5);
  const [lucid, setLucid] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, emotion, clarity }),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error ?? "Ошибка анализа");
      }
      const payload = (await response.json()) as AnalysisResult;
      setAnalysis(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка анализа");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!description.trim()) {
      setError("Добавьте описание сна.");
      return;
    }
    setError(null);
    const data: DreamInput = {
      title,
      description,
      emotion,
      clarity,
      lucid,
      interpretation: analysis?.interpretation,
      analysis: analysis?.psychologicalMeaning,
      symbols: analysis?.symbols,
      tags: analysis?.symbols?.map((symbol) => symbol.name) ?? [],
    };

    startTransition(async () => {
      try {
        const result = await createDreamAction(data);
        router.push(`/dream/${result.id}`);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось сохранить сон. Проверьте подключение к базе."
        );
      }
    });
  }

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Название сна (опционально)</label>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Название сна (опционально)"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Опишите сон подробнее...</label>
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Опишите сон подробнее..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Выберите эмоцию</label>
        <div className="emotion-chips">
          {emotions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setEmotion(item.value)}
              className={`emotion-chip ${emotion === item.value ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Насколько ясен был сон?</label>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-secondary)" }}>{clarity}/10</span>
        </div>
        <Slider
          min={1}
          max={10}
          value={clarity}
          onChange={(event) => setClarity(Number(event.target.value))}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={lucid}
            onChange={(event) => setLucid(event.target.checked)}
            style={{ marginRight: "8px" }}
          />
          Это был осознанный сон?
        </label>
      </div>

      {error ? (
        <div style={{ color: "var(--accent-pink)", marginBottom: "12px" }}>
          {error}
        </div>
      ) : null}

      <div className="form-group">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || !description.trim()}
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
        >
          {loading ? "Анализирую сон..." : "✨ Проанализировать сон"}
        </button>
      </div>
      <div className="form-group">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending}
          className="btn btn-secondary"
          style={{ width: "100%", justifyContent: "center" }}
        >
          {pending ? "Сохраняю..." : "Сохранить и перейти"}
        </button>
      </div>

      {analysis ? (
        <div className="form-group">
          <div className="form-label">AI анализ готов</div>
          <p className="form-textarea" style={{ minHeight: "auto" }}>
            {analysis.interpretation}
          </p>
        </div>
      ) : null}
    </div>
  );
}
