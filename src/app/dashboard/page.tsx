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

  const displayName = session.user.name ?? session.user.email ?? "пользователь";
  const email = session.user.email ?? "";
  const initial = displayName.trim().charAt(0).toUpperCase();

  return (
    <PageShell>
      <main className="container">
        <div className="section-header">
          <h1 className="section-title">Личный кабинет</h1>
        </div>
        <div className="dream-card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={displayName}
                width={48}
                height={48}
                style={{ borderRadius: "999px", objectFit: "cover" }}
              />
            ) : (
              <div
                aria-hidden="true"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(124, 58, 237, 0.2)",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  fontSize: "18px",
                }}
              >
                {initial || "?"}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "16px", color: "var(--text-primary)" }}>
                {displayName}
              </span>
              {email ? (
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  {email}
                </span>
              ) : null}
            </div>
          </div>
          <p className="dream-description">
            Вы вошли как {displayName}.
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
