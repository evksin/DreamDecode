import { Card } from "@/components/ui/Card";
import type { Dream, Symbol } from "@prisma/client";

type DreamWithSymbols = Dream & { symbols: Symbol[] };

export function DreamAnalysis({ dream }: { dream: DreamWithSymbols }) {
  return (
    <div className="space-y-6">
      <Card className="space-y-2">
        <div className="text-xs text-text-secondary">
          {dream.dreamDate.toLocaleDateString("ru-RU")}
        </div>
        <div className="text-lg font-semibold">{dream.title}</div>
        <div className="text-sm text-text-secondary">{dream.description}</div>
        <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
          <span>Эмоция: {dream.emotion ?? "не указано"}</span>
          <span>Ясность: {dream.clarity ?? "—"}</span>
          <span>{dream.lucid ? "Осознанный сон" : "Обычный сон"}</span>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-base font-semibold">Интерпретация</h2>
        <p className="text-sm text-text-secondary">
          {dream.interpretation ?? "AI анализ не выполнялся."}
        </p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-base font-semibold">Психологический смысл</h2>
        <p className="text-sm text-text-secondary whitespace-pre-line">
          {dream.analysis ?? "Добавьте анализ для полного отчёта."}
        </p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-base font-semibold">Символы и значения</h2>
        <div className="space-y-3">
          {dream.symbols.length ? (
            dream.symbols.map((symbol) => (
              <div
                key={symbol.id}
                className="flex items-start gap-3 text-sm text-text-secondary"
              >
                <span className="text-lg">✨</span>
                <div>
                  <div className="text-sm font-semibold text-text-primary">
                    {symbol.name}
                  </div>
                  <div>{symbol.meaning}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-text-secondary">
              Символы ещё не выделены.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
