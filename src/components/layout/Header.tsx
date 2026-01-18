import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-dream bg-gradient-to-br from-bg-dream-800 to-bg-dream-700 shadow-dream-sm">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="flex items-center gap-3 text-text-dream-50">
          <span className="text-2xl">🌙</span>
          <span className="text-xl font-bold tracking-tight">DreamDecode</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm text-text-dream-400">
          <Link
            href="/"
            className="group relative transition-all duration-300 hover:text-accent-purple"
          >
            Главная
            <span className="absolute -bottom-2 left-0 h-0.5 w-0 bg-accent-purple transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/dreams"
            className="group relative transition-all duration-300 hover:text-accent-purple"
          >
            Мои сны
            <span className="absolute -bottom-2 left-0 h-0.5 w-0 bg-accent-purple transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/analytics"
            className="group relative transition-all duration-300 hover:text-accent-purple"
          >
            Аналитика
            <span className="absolute -bottom-2 left-0 h-0.5 w-0 bg-accent-purple transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/dream/new" className="w-full md:w-auto">
            <Button className="flex items-center gap-2 px-5 py-2 text-sm">
              + Записать
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
