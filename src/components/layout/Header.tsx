import Link from "next/link";
import { MdBedtime, MdMoon } from "react-icons/md";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="w-full bg-gradient-to-br from-[#1E1B4B] to-[#2A1D5C] px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-dream-800 text-accent-purple">
            <MdBedtime className="text-2xl" />
          </div>
          <div>
            <div className="text-xl font-semibold tracking-tight text-text-dream-50">
              DreamDecode
            </div>
            <div className="text-sm text-text-dream-400">
              Следите за снами и получайте AI-анализ
            </div>
          </div>
        </Link>
        <Link href="/dream/new" className="w-full md:w-auto">
          <Button className="flex w-full items-center justify-center gap-2 md:w-auto">
            <MdMoon className="text-lg" />
            Записать сон
          </Button>
        </Link>
      </div>
    </header>
  );
}
