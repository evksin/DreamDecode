import Link from "next/link";
import { RiMoonClearLine } from "react-icons/ri";
import { RiStarsLine } from "react-icons/ri";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border-color px-4 py-4 md:px-8">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-secondary/80 text-accent-primary">
          <RiMoonClearLine className="text-xl" />
        </div>
        <div>
          <div className="text-lg font-semibold tracking-tight">
            DreamDecode
          </div>
          <div className="text-xs text-text-secondary">
            Дневник снов и анализ
          </div>
        </div>
      </Link>
      <div className="hidden items-center gap-2 text-text-secondary md:flex">
        <RiStarsLine className="text-lg text-accent-secondary" />
        <span className="text-sm">Ночная аналитика</span>
      </div>
    </header>
  );
}
