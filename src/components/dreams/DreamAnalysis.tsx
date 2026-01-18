import { Card } from "@/components/ui/Card";
import { FaStar } from "react-icons/fa";
import type { Dream, Symbol } from "@prisma/client";

type DreamWithSymbols = Dream & { symbols: Symbol[] };

export function DreamAnalysis({ dream }: { dream: DreamWithSymbols }) {
  const clarityScore = dream.clarity ?? 0;
  const stars = Math.max(1, Math.round(clarityScore / 2));
  const clarityWidthClass =
    clarityScore >= 9
      ? "w-full"
      : clarityScore >= 7
        ? "w-4/5"
        : clarityScore >= 5
          ? "w-3/5"
          : clarityScore >= 3
            ? "w-2/5"
            : "w-1/5";

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xs text-text-dream-400">Дата</div>
            <div className="text-sm text-text-dream-50">
              {dream.dreamDate.toLocaleDateString("ru-RU")}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-dream-400">Название</div>
            <div className="text-sm font-semibold text-text-dream-50">
              {dream.title}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-dream-400">Эмоция</div>
            <div className="text-sm text-text-dream-50">
              {dream.emotion ?? "не указано"}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-dream-400">Ясность</div>
            <div className="flex items-center gap-1 text-accent-purple">
              {Array.from({ length: stars }).map((_, index) => (
                <FaStar key={`${dream.id}-clarity-${index}`} className="text-sm" />
              ))}
            </div>
          </div>
        </div>
        <div className="text-sm text-text-dream-400">{dream.description}</div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-base font-semibold text-text-dream-50">
              Интерпретация
            </h2>
            <p className="text-sm text-text-dream-400 leading-relaxed">
              {dream.interpretation ?? "AI анализ не выполнялся."}
            </p>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-base font-semibold text-text-dream-50">
              Психологический смысл
            </h2>
            <p className="text-sm text-text-dream-400 whitespace-pre-line leading-relaxed">
              {dream.analysis ?? "Добавьте анализ для полного отчёта."}
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-base font-semibold text-text-dream-50">
              Символы и значения
            </h2>
            <div className="space-y-3">
              {dream.symbols.length ? (
                dream.symbols.map((symbol) => (
                  <div
                    key={symbol.id}
                    className="flex items-start gap-3 rounded-lg border border-border-dream bg-bg-dream-800/50 p-3 text-sm text-text-dream-400"
                  >
                    <span className="text-lg">✨</span>
                    <div>
                      <div className="text-sm font-semibold text-text-dream-50">
                        {symbol.name}
                      </div>
                      <div>{symbol.meaning}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-dream-400">
                  Символы ещё не выделены.
                </p>
              )}
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="text-sm font-semibold text-text-dream-50">
              Статистика
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border border-border-dream bg-bg-dream-800/60 p-3 text-sm text-text-dream-400">
                Ясность: {clarityScore}/10
                <div className="mt-2 h-2 w-full rounded-full bg-bg-dream-700">
                  <div
                    className={`h-2 rounded-full bg-accent-purple ${clarityWidthClass}`}
                  />
                </div>
              </div>
              <div className="rounded-lg border border-border-dream bg-bg-dream-800/60 p-3 text-sm text-text-dream-400">
                Вид сна: {dream.lucid ? "осознанный" : "обычный"}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
