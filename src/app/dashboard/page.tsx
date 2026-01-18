import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { LogoutButton } from "@/components/auth/AuthButtons";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <PageShell>
      <main className="container">
        <div className="section-header">
          <h1 className="section-title">Личный кабинет</h1>
        </div>
        <div className="dream-card">
          <p className="dream-description">
            Вы вошли как {session.user.name ?? session.user.email ?? "пользователь"}.
          </p>
          <p className="dream-description">Ваш userId: {session.user.id}</p>
          <div style={{ marginTop: "16px" }}>
            <LogoutButton />
          </div>
        </div>
      </main>
    </PageShell>
  );
}
