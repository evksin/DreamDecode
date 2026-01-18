import Link from "next/link";
import { MdBedtime, MdMoon } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";

const links = [
  { href: "/", label: "Главная", icon: MdBedtime },
  { href: "/dream/new", label: "Новый сон", icon: MdMoon },
  { href: "/analytics", label: "Аналитика", icon: BsGraphUp },
];

export function Sidebar() {
  return (
    <aside className="hidden h-full w-64 flex-col gap-4 border-r border-border-dream bg-bg-dream-800/40 px-6 py-6 md:flex">
      <div className="flex items-center gap-3 rounded-2xl border border-border-dream bg-bg-dream-800/70 px-4 py-4">
        <BsGraphUp className="text-2xl text-accent-purple" />
        <div>
          <div className="text-sm font-semibold text-text-dream-50">
            AI-интерпретация
          </div>
          <div className="text-xs text-text-dream-400">
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
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-text-dream-400 transition-all duration-300 hover:bg-bg-dream-700/40 hover:text-text-dream-50"
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
