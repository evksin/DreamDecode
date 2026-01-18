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
      const result = await createDreamAction(data);
      router.push(`/dream/${result.id}`);
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <label className="text-sm text-text-dream-400">
          Название (опционально)
        </label>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Название сна (опционально)"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm text-text-dream-400">
          Опишите сон подробнее...
        </label>
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Опишите сон подробнее..."
          className="min-h-[300px]"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm text-text-dream-400">
          Выберите эмоцию
        </label>
        <div className="flex flex-wrap gap-3">
          {emotions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setEmotion(item.value)}
            >
              <Badge active={emotion === item.value}>{item.label}</Badge>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-text-dream-400">
          <span>Насколько ясен был сон?</span>
          <span>{clarity}/10</span>
        </div>
        <Slider
          min={1}
          max={10}
          value={clarity}
          onChange={(event) => setClarity(Number(event.target.value))}
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-text-dream-400">
        <input
          type="checkbox"
          checked={lucid}
          onChange={(event) => setLucid(event.target.checked)}
          className="h-4 w-4 rounded border-border-dream bg-bg-dream-800 text-accent-purple"
        />
        Это был осознанный сон
      </label>

      {error ? (
        <div className="text-sm text-accent-pink">{error}</div>
      ) : null}

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || !description.trim()}
          className="w-full px-4 py-4 text-base font-semibold transition-all duration-300 hover:scale-[1.02]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg-dream-900 border-t-transparent" />
              Анализирую сон...
            </span>
          ) : (
            "✨ Проанализировать сон"
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleSubmit}
          disabled={pending}
          className="w-full px-4 py-4 text-base transition-all duration-300 hover:scale-[1.02]"
        >
          {pending ? "Сохраняю..." : "Сохранить и перейти"}
        </Button>
      </div>

      {analysis ? (
        <div className="rounded-xl border border-border-dream bg-bg-dream-800/80 p-4 text-sm text-text-dream-400">
          <div className="mb-2 text-sm font-semibold text-text-dream-50">
            AI анализ готов
          </div>
          <p className="mb-3">{analysis.interpretation}</p>
          <div className="flex flex-wrap gap-2">
            {analysis.symbols.map((symbol) => (
              <span
                key={symbol.name}
                className="rounded-full border border-border-dream px-3 py-1 text-xs"
              >
                {symbol.name}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
