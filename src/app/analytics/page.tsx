import { PageShell } from "@/components/layout/PageShell";
import { MonthlyChart } from "@/components/analytics/MonthlyChart";
import { SymbolCloud } from "@/components/analytics/SymbolCloud";
import { getDreamAnalytics } from "@/lib/dreams";
import { MdBedtime } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AnalyticsPage() {
  const analytics = await getDreamAnalytics();
  const topEmotionLabel = analytics.topEmotion
    ? `${analytics.topEmotion} 😌`
    : "—";
  const topSymbolLabel = analytics.topSymbols[0]?.name
    ? `${analytics.topSymbols[0]?.name} 🌊`
    : "—";

  return (
    <PageShell>
      <main className="container">
        <div className="section-header">
          <h1 className="section-title">📊 Аналитика</h1>
        </div>

        <div className="dreams-grid">
          <div className="dream-card">
            <div className="dream-card-header">
              <MdBedtime className="dream-emotion" />
              <span className="dream-date">Всего снов</span>
            </div>
            <h3 className="dream-title">{analytics.totalDreams}</h3>
            <p className="dream-description">Записей за всё время</p>
          </div>
          <div className="dream-card">
            <div className="dream-card-header">
              <FaStar className="dream-emotion" />
              <span className="dream-date">Средняя ясность</span>
            </div>
            <h3 className="dream-title">{analytics.avgClarity.toFixed(1)}</h3>
            <p className="dream-description">Сводная оценка</p>
          </div>
          <div className="dream-card">
            <div className="dream-card-header">
              <MdBedtime className="dream-emotion" />
              <span className="dream-date">Частая эмоция</span>
            </div>
            <h3 className="dream-title">{topEmotionLabel}</h3>
            <p className="dream-description">Лидер месяца</p>
          </div>
          <div className="dream-card">
            <div className="dream-card-header">
              <BsGraphUp className="dream-emotion" />
              <span className="dream-date">Топ символ</span>
            </div>
            <h3 className="dream-title">{topSymbolLabel}</h3>
            <p className="dream-description">Самый частый символ</p>
          </div>
        </div>

        <div className="container" style={{ padding: "32px 0" }}>
          <div className="dreams-grid">
            <div className="dream-card">
              <h3 className="dream-title">График эмоций</h3>
              <MonthlyChart data={analytics.monthlySeries} />
            </div>
            <div className="dream-card">
              <h3 className="dream-title">Облако символов</h3>
              <SymbolCloud symbols={analytics.topSymbols} />
            </div>
          </div>
        </div>

        <div className="dream-card">
          <div className="dream-card-header">
            <span className="dream-emotion">🏆</span>
            <span className="dream-date">Топ-10 символов</span>
          </div>
          {analytics.topSymbols.map((symbol, index) => (
            <p key={symbol.name} className="dream-description">
              {index + 1}. {symbol.name} — {symbol.frequency}x
            </p>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
