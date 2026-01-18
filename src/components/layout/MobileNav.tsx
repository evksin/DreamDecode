import Link from "next/link";
import { RiHome4Line, RiPieChartLine, RiQuillPenLine } from "react-icons/ri";

const items = [
  { href: "/", label: "Home", icon: RiHome4Line },
  { href: "/dream/new", label: "New", icon: RiQuillPenLine },
  { href: "/analytics", label: "Stats", icon: RiPieChartLine },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 flex w-[90%] max-w-md -translate-x-1/2 justify-around rounded-2xl border border-border-color bg-bg-secondary/90 px-4 py-3 backdrop-blur md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 text-xs text-text-secondary"
          >
            <Icon className="text-lg text-accent-primary" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
