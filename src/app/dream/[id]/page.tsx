import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { DreamAnalysis } from "@/components/dreams/DreamAnalysis";
import { getDreamById } from "@/lib/dreams";
import { DeleteDreamButton } from "@/components/dreams/DeleteDreamButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DreamPageProps = {
  params: { id: string };
};

export default async function DreamPage({ params }: DreamPageProps) {
  const id = params.id;
  if (!id) {
    notFound();
  }
  const dream = await getDreamById(id);
  if (!dream) {
    notFound();
  }

  return (
    <PageShell>
      <main className="container">
        <div className="section-header">
          <h1 className="section-title">🔮 Анализ сна</h1>
          <div className="header-nav">
            <a className="btn btn-secondary" href="/dream/new">
              🔄 Переанализировать
            </a>
            <Button variant="secondary" disabled>
              ❤️ Сохранить
            </Button>
            <DeleteDreamButton id={dream.id} />
          </div>
        </div>
        <DreamAnalysis dream={dream} />
      </main>
    </PageShell>
  );
}
