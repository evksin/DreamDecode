import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

type PageShellProps = {
  children: ReactNode;
  rightPanel?: ReactNode;
};

export function PageShell({ children, rightPanel }: PageShellProps) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <div className="flex min-h-[calc(100vh-72px)]">
        <Sidebar />
        <main className="flex-1 px-4 py-6 pb-24 md:px-8">{children}</main>
        {rightPanel ? (
          <aside className="hidden w-80 border-l border-border-color px-6 py-6 lg:block">
            {rightPanel}
          </aside>
        ) : null}
      </div>
      <MobileNav />
    </div>
  );
}
