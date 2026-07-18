"use client";

import { FACES, parseMove, type Move } from "@/lib/moves";

export function ManualControls({
  onMove,
  disabled,
}: {
  onMove: (move: Move) => void;
  disabled: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h2 className="mb-3 text-sm font-semibold text-zinc-300">Manual turns</h2>
      <div className="grid grid-cols-6 gap-1.5">
        {FACES.map((face) => (
          <button
            key={face}
            onClick={() => onMove(parseMove(face))}
            disabled={disabled}
            className="rounded-md bg-zinc-800 py-1.5 font-mono text-sm text-zinc-200 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {face}
          </button>
        ))}
        {FACES.map((face) => (
          <button
            key={`${face}'`}
            onClick={() => onMove(parseMove(`${face}'`))}
            disabled={disabled}
            className="rounded-md bg-zinc-800 py-1.5 font-mono text-sm text-zinc-200 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {face}&apos;
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        Turn faces yourself, then press Solve to solve the new state.
      </p>
    </div>
  );
}
