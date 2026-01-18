import { notFound } from "next/navigation";
import Link from "next/link";
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
  const dream = await getDreamById(params.id);
  if (!dream) {
    notFound();
  }

  return (
    <PageShell
      rightPanel={
        <div className="space-y-4 text-sm text-text-dream-400">
          <div className="rounded-2xl border border-border-dream bg-bg-dream-800/60 p-4">
            <div className="text-sm font-semibold text-text-dream-50">
              Астрологический оттенок
            </div>
            <p className="mt-2 text-xs">
              Луна в Скорпионе усиливает эмоциональность и глубину переживаний.
            </p>
          </div>
        </div>
      }
    >
      <div className="mx-auto w-full max-w-6xl space-y-6 px-2 md:px-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-text-dream-50">
              Анализ сна
            </h1>
            <p className="text-sm text-text-dream-400">
              Результаты AI-интерпретации и символов.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/dream/new`}>
              <Button variant="secondary">🔄 Переанализировать</Button>
            </Link>
            <Button variant="secondary" disabled>
              ❤️ Сохранить
            </Button>
            <DeleteDreamButton id={dream.id} />
          </div>
        </div>
        <DreamAnalysis dream={dream} />
      </div>
    </PageShell>
  );
}
