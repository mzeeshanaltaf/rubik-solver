import { DEMO_SOLVES } from "@/lib/demo-solves";
import { STICKER_COLORS } from "@/lib/cube-logic";
import { Reveal } from "./reveal";

const FACES = ["U", "D", "L", "R", "F", "B"] as const;
const SUFFIXES = ["", "'"] as const;

function PlaybackChips() {
  const moves = DEMO_SOLVES[1].solution.split(/\s+/).slice(0, 12);
  const current = 4;
  return (
    <div className="mt-5 flex flex-wrap gap-1.5" aria-hidden>
      {moves.map((m, i) => (
        <span
          key={i}
          className={`rounded-md px-2 py-1 font-mono text-xs ${
            i === current
              ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
              : i < current
                ? "bg-zinc-800 text-zinc-500"
                : "bg-zinc-800/60 text-zinc-300"
          }`}
        >
          {m}
        </span>
      ))}
      <span className="px-1 py-1 font-mono text-xs text-zinc-600">…</span>
    </div>
  );
}

function ManualMoveGrid() {
  return (
    <div className="mt-5 grid grid-cols-6 gap-1" aria-hidden>
      {SUFFIXES.flatMap((s) =>
        FACES.map((f) => (
          <span
            key={f + s}
            className="rounded-md bg-zinc-800/60 py-1 text-center font-mono text-[11px] text-zinc-400"
          >
            {f}
            {s}
          </span>
        ))
      )}
    </div>
  );
}

function StickerStrip({ colors }: { colors: string[] }) {
  return (
    <div className="mt-5 flex gap-1.5" aria-hidden>
      {colors.map((c) => (
        <span
          key={c}
          className="h-2.5 w-2.5 rounded-[3px]"
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

export function Features() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tighter text-zinc-100 md:text-4xl">
            Watch the solution, or take the wheel
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-6">
          <Reveal className="lg:col-span-4">
            <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
              <h3 className="text-lg font-semibold text-zinc-100">
                Move-by-move playback
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Play, pause, step forward or back, and set the speed. The
                current move stays highlighted as the cube turns.
              </p>
              <PlaybackChips />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-2">
            <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
              <h3 className="text-lg font-semibold text-zinc-100">
                Manual mode
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Turn any face clockwise or counterclockwise, then solve from
                the new state.
              </p>
              <ManualMoveGrid />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-2">
            <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/60 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.08),transparent_60%)] p-6">
              <h3 className="text-lg font-semibold text-zinc-100">
                Nothing leaves your machine
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                The solver runs in a Web Worker. Pruning tables build once,
                locally, with no server round-trips.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16} className="lg:col-span-4">
            <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
              <h3 className="text-lg font-semibold text-zinc-100">
                True 3D, never out of sync
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Drag to orbit, scroll to zoom. Every turn animates on the real
                cube state, so the picture can never drift from the math.
              </p>
              <StickerStrip
                colors={[
                  STICKER_COLORS.U,
                  STICKER_COLORS.R,
                  STICKER_COLORS.F,
                  STICKER_COLORS.D,
                  STICKER_COLORS.L,
                  STICKER_COLORS.B,
                ]}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
