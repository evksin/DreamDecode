import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PageShell } from "@/components/layout/PageShell";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { PromptDashboard } from "@/components/dashboard/PromptDashboard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function PublicPromptsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <PageShell>
      <main className="container" style={{ paddingTop: "32px", paddingBottom: "40px" }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          <DashboardSidebar
            activeKey="public"
            name={session.user.name ?? session.user.email ?? "Пользователь"}
            email={session.user.email}
            image={session.user.image}
          />
          <div style={{ flex: 1 }}>
            <PromptDashboard mode="public" />
          </div>
        </div>
      </main>
    </PageShell>
  );
}
