import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { MonthlyChart } from "@/components/analytics/MonthlyChart";
import { SymbolCloud } from "@/components/analytics/SymbolCloud";
import { getDreamAnalytics } from "@/lib/dreams";
import { MdBedtime, MdMoon } from "react-icons/md";
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-dream-50">
            Аналитика
          </h1>
          <p className="text-sm text-text-dream-400">
            Статистика за месяц и повторяющиеся паттерны.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center gap-4">
            <MdBedtime className="text-3xl text-accent-purple" />
            <div>
              <div className="text-xs text-text-dream-400">Всего снов</div>
              <div className="text-2xl font-semibold text-text-dream-50">
                {analytics.totalDreams}
              </div>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <FaStar className="text-3xl text-accent-purple" />
            <div>
              <div className="text-xs text-text-dream-400">Средняя ясность</div>
              <div className="text-2xl font-semibold text-text-dream-50">
                {analytics.avgClarity.toFixed(1)}
              </div>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <MdMoon className="text-3xl text-accent-purple" />
            <div>
              <div className="text-xs text-text-dream-400">Частая эмоция</div>
              <div className="text-lg font-semibold text-text-dream-50">
                {topEmotionLabel}
              </div>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <BsGraphUp className="text-3xl text-accent-purple" />
            <div>
              <div className="text-xs text-text-dream-400">Топ символ</div>
              <div className="text-lg font-semibold text-text-dream-50">
                {topSymbolLabel}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="mb-3 text-sm font-semibold text-text-dream-50">
              График эмоций
            </div>
            <MonthlyChart data={analytics.monthlySeries} />
          </Card>
          <Card>
            <div className="mb-3 text-sm font-semibold text-text-dream-50">
              Облако символов
            </div>
            <SymbolCloud symbols={analytics.topSymbols} />
          </Card>
        </div>

        <Card>
          <div className="mb-4 text-sm font-semibold text-text-dream-50">
            Топ-10 символов
          </div>
          <div className="divide-y divide-border-dream text-sm text-text-dream-400">
            {analytics.topSymbols.map((symbol, index) => (
              <div
                key={symbol.name}
                className="flex items-center justify-between py-2"
              >
                <span>
                  {index + 1}. {symbol.name}
                </span>
                <span>{symbol.frequency}x</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
