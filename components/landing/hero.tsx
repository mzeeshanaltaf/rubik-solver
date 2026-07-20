import Link from "next/link";
import { HeroCubeIsland } from "./hero-cube-island";

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
        <div>
          <p className="animate-fade-up font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-400">
            Kociemba two-phase algorithm
          </p>
          <h1
            className="animate-fade-up mt-4 text-4xl font-bold tracking-tighter text-zinc-100 md:text-5xl lg:text-[2.75rem] lg:leading-[1.1]"
            style={{ "--fade-delay": "0.08s" } as React.CSSProperties}
          >
            Any scramble, solved in about twenty moves.
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-[46ch] text-base leading-relaxed text-zinc-400"
            style={{ "--fade-delay": "0.16s" } as React.CSSProperties}
          >
            A 3D Rubik&apos;s Cube solver that runs entirely in your browser and
            animates every move of the solution.
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
            style={{ "--fade-delay": "0.24s" } as React.CSSProperties}
          >
            <Link
              href="/solve"
              className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 active:translate-y-px"
            >
              Solve a cube
            </Link>
            <a
              href="#how-it-works"
              className="rounded-lg border border-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100 active:translate-y-px"
            >
              How it works
            </a>
          </div>
        </div>

        <div
          role="img"
          aria-label="A 3D Rubik's Cube scrambling and then solving itself, one animated face turn at a time."
          className="h-[52dvh] min-h-80 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 lg:h-[560px]"
        >
          <HeroCubeIsland />
        </div>
      </div>
    </section>
  );
}
