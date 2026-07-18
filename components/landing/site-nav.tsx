import Link from "next/link";
import { STICKER_COLORS } from "@/lib/cube-logic";

const MARK_COLORS = [
  STICKER_COLORS.F,
  STICKER_COLORS.R,
  STICKER_COLORS.B,
  STICKER_COLORS.D,
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid grid-cols-2 gap-0.5" aria-hidden>
            {MARK_COLORS.map((c) => (
              <span
                key={c}
                className="h-2 w-2 rounded-[2px]"
                style={{ backgroundColor: c }}
              />
            ))}
          </span>
          <span className="text-sm font-bold tracking-tight">Rubik Solver</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/#how-it-works"
            className="hidden text-sm text-zinc-400 transition-colors hover:text-zinc-200 sm:block"
          >
            How it works
          </Link>
          <Link
            href="/contact"
            className="hidden text-sm text-zinc-400 transition-colors hover:text-zinc-200 sm:block"
          >
            Contact
          </Link>
          <Link
            href="/solve"
            className="rounded-lg bg-emerald-700 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 active:translate-y-px"
          >
            Solve a cube
          </Link>
        </nav>
      </div>
    </header>
  );
}
