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
      <div className="space-y-6">
        <div className="section-header flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h2 className="text-2xl font-bold text-text-dream-50">Все сны</h2>
          <Link
            href="/dream/new"
            className="text-sm font-semibold text-accent-purple transition-all duration-300 hover:text-accent-pink"
          >
            + Записать сон
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
