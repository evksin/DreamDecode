import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { MonthlyChart } from "@/components/analytics/MonthlyChart";
import { SymbolCloud } from "@/components/analytics/SymbolCloud";
import { getDreamAnalytics } from "@/lib/dreams";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AnalyticsPage() {
  const analytics = await getDreamAnalytics();

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Аналитика</h1>
          <p className="text-sm text-text-secondary">
            Статистика за месяц и повторяющиеся паттерны.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="text-xs text-text-secondary">Всего снов</div>
            <div className="text-2xl font-semibold">
              {analytics.totalDreams}
            </div>
          </Card>
          <Card>
            <div className="text-xs text-text-secondary">Средняя ясность</div>
            <div className="text-2xl font-semibold">
              {analytics.avgClarity.toFixed(1)}
            </div>
          </Card>
          <Card>
            <div className="text-xs text-text-secondary">Частая эмоция</div>
            <div className="text-2xl font-semibold">
              {analytics.topEmotion ?? "—"}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="mb-3 text-sm font-semibold">График эмоций</div>
            <MonthlyChart data={analytics.monthlySeries} />
          </Card>
          <Card>
            <div className="mb-3 text-sm font-semibold">Облако символов</div>
            <SymbolCloud symbols={analytics.topSymbols} />
          </Card>
        </div>

        <Card>
          <div className="mb-4 text-sm font-semibold">Топ-10 символов</div>
          <div className="divide-y divide-border-color text-sm text-text-secondary">
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
