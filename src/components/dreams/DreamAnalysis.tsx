import { FaStar } from "react-icons/fa";
import type { Dream, Symbol } from "@prisma/client";

type DreamWithSymbols = Dream & { symbols: Symbol[] };

export function DreamAnalysis({ dream }: { dream: DreamWithSymbols }) {
  const clarityScore = dream.clarity ?? 0;
  const stars = Math.max(1, Math.round(clarityScore / 2));

  return (
    <div>
      <div className="dream-card">
        <div className="dream-card-header">
          <span className="dream-emotion">
            {dream.emotion ? "✨" : "🌙"}
          </span>
          <span className="dream-date">
            {dream.dreamDate.toLocaleDateString("ru-RU")}
          </span>
        </div>
        <h3 className="dream-title">{dream.title || "Сон без названия"}</h3>
        <p className="dream-description">{dream.description}</p>
        <div className="dream-clarity">
          {Array.from({ length: stars }).map((_, index) => (
            <FaStar key={`${dream.id}-clarity-${index}`} className="star" />
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: "32px 0" }}>
        <div className="dreams-grid">
          <div className="dream-card">
            <h3 className="dream-title">Интерпретация</h3>
            <p className="dream-description" style={{ display: "block" }}>
              {dream.interpretation ?? "AI анализ не выполнялся."}
            </p>
          </div>
          <div className="dream-card">
            <h3 className="dream-title">Психологический смысл</h3>
            <p className="dream-description" style={{ display: "block" }}>
              {dream.analysis ?? "Добавьте анализ для полного отчёта."}
            </p>
          </div>
        </div>
      </div>

      <div className="dreams-grid">
        <div className="dream-card">
          <h3 className="dream-title">Символы и значения</h3>
          {dream.symbols.length ? (
            dream.symbols.map((symbol) => (
              <p
                key={symbol.id}
                className="dream-description"
                style={{ display: "block" }}
              >
                ✨ {symbol.name} — {symbol.meaning}
              </p>
            ))
          ) : (
            <p className="dream-description" style={{ display: "block" }}>
              Символы ещё не выделены.
            </p>
          )}
        </div>
        <div className="dream-card">
          <h3 className="dream-title">Статистика</h3>
          <p className="dream-description">Ясность: {clarityScore}/10</p>
          <p className="dream-description">
            Вид сна: {dream.lucid ? "осознанный" : "обычный"}
          </p>
        </div>
      </div>
    </div>
  );
}
