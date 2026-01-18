import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { DreamForm } from "@/components/dreams/DreamForm";

export default function NewDreamPage() {
  return (
    <PageShell>
      <main className="container">
        <div className="section-header">
          <h1 className="section-title">📝 Новый сон</h1>
          <Link className="view-all" href="/">
            На главную →
          </Link>
        </div>
        <DreamForm />
      </main>
    </PageShell>
  );
}
