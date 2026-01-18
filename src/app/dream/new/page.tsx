import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { DreamForm } from "@/components/dreams/DreamForm";

export default function NewDreamPage() {
  return (
    <PageShell
      rightPanel={
        <div className="space-y-6">
          <Card className="space-y-2">
            <div className="text-sm font-semibold">Быстрые подсказки</div>
            <ul className="list-disc space-y-2 pl-4 text-xs text-text-secondary">
              <li>Добавьте ключевые символы и эмоции.</li>
              <li>Опишите сцену и окружение.</li>
              <li>Уточните, был ли сон осознанным.</li>
            </ul>
          </Card>
          <Card className="space-y-2">
            <div className="text-sm font-semibold">Теги</div>
            <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
              <span className="rounded-full border border-border-color px-3 py-1">
                луна
              </span>
              <span className="rounded-full border border-border-color px-3 py-1">
                вода
              </span>
              <span className="rounded-full border border-border-color px-3 py-1">
                полёт
              </span>
            </div>
          </Card>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Новый сон</h1>
          <p className="text-sm text-text-secondary">
            Запишите сон и получите AI-анализ.
          </p>
        </div>
        <DreamForm />
      </div>
    </PageShell>
  );
}
