import Link from "next/link";
import { RiBrainLine, RiHome4Line, RiPieChartLine, RiQuillPenLine } from "react-icons/ri";

const links = [
  { href: "/", label: "Главная", icon: RiHome4Line },
  { href: "/dream/new", label: "Новый сон", icon: RiQuillPenLine },
  { href: "/analytics", label: "Аналитика", icon: RiPieChartLine },
];

export function Sidebar() {
  return (
    <aside className="hidden h-full w-64 flex-col gap-4 border-r border-border-color bg-bg-secondary/40 px-6 py-6 md:flex">
      <div className="flex items-center gap-3 rounded-2xl border border-border-color bg-bg-secondary/70 px-4 py-4">
        <RiBrainLine className="text-2xl text-accent-primary" />
        <div>
          <div className="text-sm font-semibold">AI-интерпретация</div>
          <div className="text-xs text-text-secondary">
            Юнг · Фрейд · психология
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-2 text-sm">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-text-secondary transition hover:bg-bg-tertiary/40 hover:text-text-primary"
            >
              <Icon className="text-lg" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
