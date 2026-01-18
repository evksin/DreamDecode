import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function MyPromptsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const prompts = await prisma.prompt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageShell>
      <main className="container">
        <div className="section-header">
          <h1 className="section-title">Мои промты</h1>
        </div>
        <div className="dreams-grid">
          {prompts.length ? (
            prompts.map((prompt) => (
              <div key={prompt.id} className="dream-card">
                <h3 className="dream-title">{prompt.title}</h3>
                <p className="dream-description">{prompt.content}</p>
                <p className="dream-description">
                  Доступ: {prompt.isPrivate ? "приватный" : "публичный"}
                </p>
              </div>
            ))
          ) : (
            <div className="dream-card">
              <p className="dream-description">Промтов пока нет.</p>
            </div>
          )}
        </div>
      </main>
    </PageShell>
  );
}
