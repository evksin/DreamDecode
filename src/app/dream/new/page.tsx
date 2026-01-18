import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { DreamForm } from "@/components/dreams/DreamForm";

export default function NewDreamPage() {
  return (
    <PageShell
      rightPanel={
        <div className="space-y-6">
          <Card className="space-y-2">
            <div className="text-sm font-semibold text-text-dream-50">
              Быстрые подсказки
            </div>
            <ul className="list-disc space-y-2 pl-4 text-xs text-text-dream-400">
              <li>Добавьте ключевые символы и эмоции.</li>
              <li>Опишите сцену и окружение.</li>
              <li>Уточните, был ли сон осознанным.</li>
            </ul>
          </Card>
          <Card className="space-y-2">
            <div className="text-sm font-semibold text-text-dream-50">Теги</div>
            <div className="flex flex-wrap gap-2 text-xs text-text-dream-400">
              <span className="rounded-full border border-border-dream px-3 py-1">
                луна
              </span>
              <span className="rounded-full border border-border-dream px-3 py-1">
                вода
              </span>
              <span className="rounded-full border border-border-dream px-3 py-1">
                полёт
              </span>
            </div>
          </Card>
        </div>
      }
    >
      <div className="mx-auto w-full max-w-3xl space-y-8 px-2 md:px-0">
        <div>
          <h1 className="text-3xl font-bold text-text-dream-50">Новый сон</h1>
          <p className="mt-2 text-sm text-text-dream-400">
            Запишите сон и получите AI-анализ.
          </p>
        </div>
        <DreamForm />
      </div>
    </PageShell>
  );
}
