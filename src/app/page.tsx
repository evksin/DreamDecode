import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { DreamCard } from "@/components/dreams/DreamCard";
import { getDreams } from "@/lib/dreams";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home() {
  const dreams = await getDreams(8, 0);

  return (
    <PageShell>
      <section className="hero">
        <h1 className="hero-title">✨ Раскройте смысл ваших снов</h1>
        <p className="hero-subtitle">
          Записывайте сны и получайте мгновенный AI-анализ с интерпретацией
          символов и психологическим смыслом
        </p>
        <Link href="/dream/new" className="hero-button">
          🌙 Начать сейчас
        </Link>
      </section>

      <main className="container">
        <div className="section-header">
          <h2 className="section-title">📚 Последние сны</h2>
          <Link href="/dreams" className="view-all">
            Все сны →
          </Link>
        </div>
        {dreams.length ? (
          <div className="dreams-grid">
            {dreams.map((dream) => (
              <DreamCard key={dream.id} dream={dream} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🌙</div>
            <div className="empty-title">Пока нет снов. Добавьте первый!</div>
            <div className="empty-text">Ваши сны будут отображаться здесь.</div>
            <Link href="/dream/new" className="btn btn-primary">
              + Записать
            </Link>
          </div>
        )}
      </main>
    </PageShell>
  );
}
