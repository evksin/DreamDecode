import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <main>{children}</main>
      <footer
        style={{
          textAlign: "center",
          padding: "40px 24px",
          borderTop: "1px solid var(--border-color)",
          color: "var(--text-secondary)",
        }}
      >
        <p>© 2026 DreamDecode. Все права защищены.</p>
      </footer>
    </div>
  );
}
