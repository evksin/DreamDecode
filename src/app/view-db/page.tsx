import { PageShell } from "@/components/layout/PageShell";
import { ViewDbClient } from "@/components/view-db/ViewDbClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function ViewDbPage() {
  return (
    <PageShell>
      <main className="container">
        <div className="section-header">
          <h1 className="section-title">🗄️ View DB</h1>
        </div>
        <ViewDbClient />
      </main>
    </PageShell>
  );
}
