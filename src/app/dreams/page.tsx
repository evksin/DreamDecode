import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { DreamCard } from "@/components/dreams/DreamCard";
import { getDreams } from "@/lib/dreams";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DreamsPage() {
  const dreams = await getDreams(24, 0);

  return (
    <PageShell>
      <main className="container">
        <div className="section-header">
          <h2 className="section-title">📚 Все сны</h2>
          <Link href="/dream/new" className="view-all">
            + Записать сон
          </Link>
        </div>
        <div className="dreams-grid">
          {dreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream} />
          ))}
        </div>
      </main>
    </PageShell>
  );
}
