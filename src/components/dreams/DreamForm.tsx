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

const emotions: EmotionType[] = [
  "Радость",
  "Страх",
  "Полёт",
  "Спокойствие",
  "Тревога",
  "Любопытство",
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
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm text-text-secondary">Название (опционально)</label>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Сон о лунном океане"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm text-text-secondary">Описание сна</label>
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Опишите сон максимально подробно..."
          className="min-h-[300px]"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm text-text-secondary">Эмоции</label>
        <div className="flex flex-wrap gap-2">
          {emotions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setEmotion(item)}
            >
              <Badge active={emotion === item}>{item}</Badge>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>Ясность сна</span>
          <span>{clarity}/10</span>
        </div>
        <Slider
          min={1}
          max={10}
          value={clarity}
          onChange={(event) => setClarity(Number(event.target.value))}
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={lucid}
          onChange={(event) => setLucid(event.target.checked)}
          className="h-4 w-4 rounded border-border-color bg-bg-primary"
        />
        Это был осознанный сон
      </label>

      {error ? <div className="text-sm text-accent-secondary">{error}</div> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || !description.trim()}
          className="flex-1"
        >
          {loading ? "Анализирую сон с помощью AI..." : "Проанализировать сон"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleSubmit}
          disabled={pending}
          className="flex-1"
        >
          {pending ? "Сохраняю..." : "Сохранить и перейти"}
        </Button>
      </div>

      {analysis ? (
        <div className="rounded-2xl border border-border-color bg-bg-secondary/60 p-4 text-sm text-text-secondary">
          <div className="mb-2 text-sm font-semibold text-text-primary">
            AI анализ готов
          </div>
          <p className="mb-3">{analysis.interpretation}</p>
          <div className="flex flex-wrap gap-2">
            {analysis.symbols.map((symbol) => (
              <span
                key={symbol.name}
                className="rounded-full border border-border-color px-3 py-1 text-xs"
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
