import Link from "next/link";
import { MdBedtime } from "react-icons/md";
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
            <div className="text-sm font-semibold text-text-dream-50">
              Паттерны 7 дней
            </div>
            <div className="space-y-2 text-xs text-text-dream-400">
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
            <div className="text-sm font-semibold text-text-dream-50">
              Настроение недели
            </div>
            <MonthlyChart data={analytics.monthlySeries.slice(-7)} />
          </Card>
        </div>
      }
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-dream-50">
              Последние сны
            </h2>
            <Link href="/analytics" className="text-sm text-accent-purple">
              Смотреть аналитику
            </Link>
          </div>
          {dreams.length ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dreams.map((dream) => (
                <DreamCard key={dream.id} dream={dream} />
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center gap-4 py-10 text-center">
              <MdBedtime className="text-4xl text-accent-purple" />
              <div className="text-base font-semibold text-text-dream-50">
                Пока нет снов. Добавьте первый!
              </div>
              <Link href="/dream/new">
                <Button className="flex items-center gap-2 px-6 py-3">
                  <MdBedtime />
                  Записать сон
                </Button>
              </Link>
            </Card>
          )}
        </section>
      </div>
    </PageShell>
  );
}
