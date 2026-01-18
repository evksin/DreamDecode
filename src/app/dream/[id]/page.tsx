import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { DreamAnalysis } from "@/components/dreams/DreamAnalysis";
import { getDreamById } from "@/lib/dreams";
import { DeleteDreamButton } from "@/components/dreams/DeleteDreamButton";

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
        <div className="space-y-4 text-sm text-text-secondary">
          <div className="rounded-2xl border border-border-color bg-bg-secondary/60 p-4">
            <div className="text-sm font-semibold text-text-primary">
              Астрологический оттенок
            </div>
            <p className="mt-2 text-xs">
              Луна в Скорпионе усиливает эмоциональность и глубину переживаний.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Анализ сна</h1>
            <p className="text-sm text-text-secondary">
              Результаты AI-интерпретации и символов.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/dream/new`}>
              <Button variant="secondary">Обновить анализ</Button>
            </Link>
            <DeleteDreamButton id={dream.id} />
            <Link href="/">
              <Button variant="ghost">Назад</Button>
            </Link>
          </div>
        </div>
        <DreamAnalysis dream={dream} />
      </div>
    </PageShell>
  );
}
