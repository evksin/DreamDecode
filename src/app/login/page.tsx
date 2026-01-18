import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { LoginButton } from "@/components/auth/AuthButtons";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <PageShell>
      <main className="container">
        <div className="section-header">
          <h1 className="section-title">Вход</h1>
        </div>
        <div className="dream-card">
          <p className="dream-description" style={{ marginBottom: "16px" }}>
            Войдите, чтобы продолжить работу с DreamDecode.
          </p>
          <LoginButton />
        </div>
      </main>
    </PageShell>
  );
}
