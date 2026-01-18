import { PageShell } from "@/components/layout/PageShell";
import { DreamForm } from "@/components/dreams/DreamForm";

export default function NewDreamPage() {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-[800px] space-y-8 px-2 md:px-0">
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
