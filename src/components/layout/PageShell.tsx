import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

type PageShellProps = {
  children: ReactNode;
  rightPanel?: ReactNode;
};

export function PageShell({ children, rightPanel }: PageShellProps) {
  return (
    <div className="min-h-screen bg-bg-dream-900">
      <Header />
      <main className="mx-auto w-full max-w-[1400px] px-6 py-12">
        {rightPanel ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>{children}</div>
            <aside className="hidden lg:block">{rightPanel}</aside>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
