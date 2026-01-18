import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DreamCard } from "@/components/dreams/DreamCard";
import { getDreams } from "@/lib/dreams";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home() {
  const dreams = await getDreams(8, 0);

  return (
    <PageShell>
      <div className="space-y-20">
        <section className="py-16 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">🧩</span>
            <h1 className="text-4xl font-extrabold text-accent-pink md:text-5xl">
              Раскройте смысл ваших снов
            </h1>
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-dream-400">
            Записывайте сны и получайте мгновенный AI-анализ с интерпретацией
            символов и психологическим смыслом
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/dream/new">
              <Button className="px-10 py-3 text-sm font-semibold shadow-dream-lg">
                🌙 Начать сейчас
              </Button>
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <h2 className="text-2xl font-bold text-text-dream-50">
              📚 Последние сны
            </h2>
            <Link
              href="/dreams"
              className="flex items-center gap-2 text-sm font-semibold text-accent-purple transition-all duration-300 hover:text-accent-pink"
            >
              Все сны →
            </Link>
          </div>
          {dreams.length ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dreams.map((dream) => (
                <DreamCard key={dream.id} dream={dream} />
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="text-6xl opacity-50">🌙</div>
              <div className="text-xl font-semibold text-text-dream-50">
                Пока нет снов. Добавьте первый!
              </div>
              <p className="text-sm text-text-dream-400">
                Ваши сны будут отображаться здесь.
              </p>
              <Link href="/dream/new">
                <Button className="px-8 py-3">+ Записать</Button>
              </Link>
            </Card>
          )}
        </section>
      </div>
    </PageShell>
  );
}
