import Link from "next/link";
import { MdBedtime, MdMoon } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";

const items = [
  { href: "/", label: "Home", icon: MdBedtime },
  { href: "/dream/new", label: "New", icon: MdMoon },
  { href: "/analytics", label: "Stats", icon: BsGraphUp },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 flex w-[90%] max-w-md -translate-x-1/2 justify-around rounded-2xl border border-border-dream bg-bg-dream-800/90 px-4 py-3 backdrop-blur md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col items-center gap-1 text-[10px] text-text-dream-400"
          >
            <Icon className="text-lg text-accent-purple" />
            <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
