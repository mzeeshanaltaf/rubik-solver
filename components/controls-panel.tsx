"use client";

export function ControlsPanel({
  onSolve,
  onScramble,
  onPlayPause,
  onStepForward,
  onStepBack,
  speedMs,
  onSpeedChange,
  playing,
  solving,
  solverReady,
  solved,
  busy,
  hasSolution,
  canStepForward,
  canStepBack,
}: {
  onSolve: () => void;
  onScramble: () => void;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  speedMs: number;
  onSpeedChange: (ms: number) => void;
  playing: boolean;
  solving: boolean;
  solverReady: boolean;
  solved: boolean;
  busy: boolean;
  hasSolution: boolean;
  canStepForward: boolean;
  canStepBack: boolean;
}) {
  const solveLabel = solving
    ? "Computing…"
    : !solverReady
      ? "Preparing solver…"
      : solved
        ? "Already solved"
        : "Solve";

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex gap-2">
        <button
          onClick={onSolve}
          disabled={!solverReady || solving || solved || busy}
          className="flex-1 rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {solveLabel}
        </button>
        <button
          onClick={onScramble}
          disabled={solving}
          className="rounded-lg bg-zinc-800 px-4 py-2.5 font-medium text-zinc-200 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          New Scramble
        </button>
      </div>

      {hasSolution && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            onClick={onStepBack}
            disabled={playing || !canStepBack}
            title="Step back"
            className="rounded-lg bg-zinc-800 px-3 py-2 text-zinc-200 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ⏮
          </button>
          <button
            onClick={onPlayPause}
            disabled={!playing && !canStepForward}
            className="min-w-24 rounded-lg bg-zinc-700 px-4 py-2 font-medium text-zinc-100 transition-colors hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={onStepForward}
            disabled={playing || !canStepForward}
            title="Step forward"
            className="rounded-lg bg-zinc-800 px-3 py-2 text-zinc-200 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ⏭
          </button>
        </div>
      )}

      <div className="mt-4">
        <label className="flex items-center gap-3 text-xs text-zinc-400">
          <span>Speed</span>
          <input
            type="range"
            min={100}
            max={600}
            step={25}
            value={700 - speedMs}
            onChange={(e) => onSpeedChange(700 - Number(e.target.value))}
            className="flex-1 accent-emerald-500"
          />
        </label>
      </div>
    </div>
  );
}
