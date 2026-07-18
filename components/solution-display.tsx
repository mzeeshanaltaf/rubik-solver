"use client";

import { toNotation, type Move } from "@/lib/moves";

export function SolutionDisplay({
  solution,
  solutionIdx,
}: {
  solution: Move[] | null;
  solutionIdx: number;
}) {
  if (!solution) return null;

  const finished = solutionIdx >= solution.length;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-300">Solution</h2>
        <span className="text-xs tabular-nums text-zinc-400">
          {finished
            ? `Solved in ${solution.length} moves 🎉`
            : `Move ${solutionIdx + 1} of ${solution.length}`}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {solution.map((move, i) => (
          <span
            key={i}
            className={`min-w-8 rounded-md px-1.5 py-1 text-center font-mono text-sm transition-colors ${
              i === solutionIdx && !finished
                ? "bg-emerald-500 font-bold text-zinc-950"
                : i < solutionIdx
                  ? "bg-zinc-800 text-zinc-500 line-through decoration-zinc-600"
                  : "bg-zinc-800 text-zinc-200"
            }`}
          >
            {toNotation(move)}
          </span>
        ))}
      </div>
    </div>
  );
}
