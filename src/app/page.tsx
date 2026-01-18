import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DreamCard } from "@/components/dreams/DreamCard";
import { getDreamAnalytics, getDreams } from "@/lib/dreams";
import { MonthlyChart } from "@/components/analytics/MonthlyChart";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home() {
  const dreams = await getDreams(8, 0);
  const analytics = await getDreamAnalytics();

  return (
    <PageShell
      rightPanel={
        <div className="space-y-6">
          <Card className="space-y-3">
            <div className="text-sm font-semibold">Паттерны 7 дней</div>
            <div className="space-y-2 text-xs text-text-secondary">
              {analytics.topSymbols.slice(0, 3).map((symbol) => (
                <div key={symbol.name} className="flex justify-between">
                  <span>{symbol.name}</span>
                  <span>{symbol.frequency}x</span>
                </div>
              ))}
              {analytics.topSymbols.length === 0 ? (
                <div>Нет данных</div>
              ) : null}
            </div>
          </Card>
          <Card>
            <div className="text-sm font-semibold">Настроение недели</div>
            <MonthlyChart data={analytics.monthlySeries.slice(-7)} />
          </Card>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="dream-gradient flex flex-col gap-4 rounded-3xl border border-border-color p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">DreamDecode</h1>
            <p className="text-sm text-text-secondary">
              Отслеживайте сны и получайте AI-анализ.
            </p>
          </div>
          <Link href="/dream/new">
            <Button size="lg">Записать сон</Button>
          </Link>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Последние сны</h2>
            <Link href="/analytics" className="text-sm text-accent-primary">
              Смотреть аналитику
            </Link>
          </div>
          {dreams.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dreams.map((dream) => (
                <DreamCard key={dream.id} dream={dream} />
              ))}
            </div>
          ) : (
            <Card>Пока нет снов. Добавьте первый!</Card>
          )}
        </section>
      </div>
    </PageShell>
  );
}
