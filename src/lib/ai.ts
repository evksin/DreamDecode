import OpenAI from "openai";
import type { AnalysisResult } from "@/types";

const PROMPT = `Ты — эксперт в психологии снов, астрологии и символизме. Проанализируй сон, используя:
- Теория Юнга (архетипы)
- Фрейд (подавленные желания)
- Современная психология

Входные данные: описание сна, эмоция, ясность

Выходные данные (JSON):
{
  "interpretation": "краткое резюме (2-3 предложения)",
  "psychologicalMeaning": "глубокий анализ (3-5 параграфов)",
  "symbols": [
    { "name": "вода", "meaning": "символ эмоций, подсознания" },
    { "name": "полет", "meaning": "свобода, амбиции" }
  ],
  "recommendations": "что это может означать"
}`;

function getOpenAIClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY не задан.");
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

function safeParseJson(payload: string): AnalysisResult | null {
  try {
    return JSON.parse(payload) as AnalysisResult;
  } catch {
    return null;
  }
}

export async function analyzeDream(params: {
  description: string;
  emotion?: string | null;
  clarity?: number | null;
}): Promise<AnalysisResult> {
  const { description, emotion, clarity } = params;

  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "openrouter/auto",
    messages: [
      { role: "system", content: PROMPT },
      {
        role: "user",
        content: `Описание: ${description}\nЭмоция: ${
          emotion ?? "не указано"
        }\nЯсность: ${clarity ?? "не указано"}`,
      },
    ],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content ?? "";
  const parsed = safeParseJson(content);
  if (parsed) {
    return parsed;
  }

  return {
    interpretation: "Не удалось получить структурированный ответ.",
    psychologicalMeaning: content || "AI не вернул анализ.",
    symbols: [],
    recommendations: "Попробуйте переформулировать описание сна.",
  };
}
