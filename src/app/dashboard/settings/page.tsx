import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PageShell } from "@/components/layout/PageShell";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <PageShell>
      <main className="container" style={{ paddingTop: "32px", paddingBottom: "40px" }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          <DashboardSidebar
            activeKey="settings"
            name={session.user.name ?? session.user.email ?? "Пользователь"}
            email={session.user.email}
            image={session.user.image}
          />
          <div style={{ flex: 1 }}>
            <div className="section-header">
              <h1 className="section-title">Личный кабинет</h1>
              <p className="section-subtitle">Настройки</p>
            </div>
            <div className="dream-card">Скоро появится.</div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
