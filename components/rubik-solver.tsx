"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import Cube from "cubejs";
import { CubeCanvas } from "./cube-canvas";
import { ControlsPanel } from "./controls-panel";
import { SolutionDisplay } from "./solution-display";
import { ManualControls } from "./manual-controls";
import {
  invert,
  parseAlg,
  randomScramble,
  toNotation,
  type Move,
} from "@/lib/moves";
import { SOLVED_FACELETS } from "@/lib/cube-logic";
import type { SolverResponse } from "@/lib/solver.worker";

type AnimKind = "solution-forward" | "solution-back" | "manual";

interface Anim {
  move: Move;
  kind: AnimKind;
}

interface CubeState {
  facelets: string;
  anim: Anim | null;
  solution: Move[] | null;
  solutionIdx: number;
  playing: boolean;
}

type CubeAction =
  | { type: "scrambled"; facelets: string }
  | { type: "solutionReady"; moves: Move[] }
  | { type: "animComplete" }
  | { type: "playPause" }
  | { type: "stepForward" }
  | { type: "stepBack" }
  | { type: "manualMove"; move: Move }
  | { type: "clearSolution" };

function scrambledFacelets(): string {
  const cube = new Cube();
  for (const move of randomScramble()) cube.move(toNotation(move));
  return cube.asString();
}

/** Pure move commit: the facelet string is the whole cube state. */
function applyMove(facelets: string, move: Move): string {
  return Cube.fromString(facelets).move(toNotation(move)).asString();
}

function initialState(): CubeState {
  return {
    facelets: scrambledFacelets(),
    anim: null,
    solution: null,
    solutionIdx: 0,
    playing: false,
  };
}

function reducer(state: CubeState, action: CubeAction): CubeState {
  switch (action.type) {
    case "scrambled":
      return {
        facelets: action.facelets,
        anim: null,
        solution: null,
        solutionIdx: 0,
        playing: false,
      };

    case "solutionReady":
      // Kick off playback immediately with the first move of the solution.
      return {
        ...state,
        solution: action.moves,
        solutionIdx: 0,
        playing: true,
        anim: { move: action.moves[0], kind: "solution-forward" },
      };

    case "animComplete": {
      if (!state.anim) return state;
      const facelets = applyMove(state.facelets, state.anim.move);
      let idx = state.solutionIdx;
      if (state.anim.kind === "solution-forward") idx += 1;
      else if (state.anim.kind === "solution-back") idx -= 1;
      // While auto-playing, chain straight into the next solution move.
      const next =
        state.playing && state.solution !== null && idx < state.solution.length
          ? state.solution[idx]
          : null;
      return {
        ...state,
        facelets,
        solutionIdx: idx,
        anim: next ? { move: next, kind: "solution-forward" } : null,
        playing: next !== null,
      };
    }

    case "playPause": {
      if (state.playing) return { ...state, playing: false };
      if (!state.solution || state.solutionIdx >= state.solution.length) {
        return state;
      }
      return {
        ...state,
        playing: true,
        anim: state.anim ?? {
          move: state.solution[state.solutionIdx],
          kind: "solution-forward",
        },
      };
    }

    case "stepForward": {
      if (state.anim || state.playing || !state.solution) return state;
      if (state.solutionIdx >= state.solution.length) return state;
      return {
        ...state,
        anim: {
          move: state.solution[state.solutionIdx],
          kind: "solution-forward",
        },
      };
    }

    case "stepBack": {
      if (state.anim || state.playing || !state.solution) return state;
      if (state.solutionIdx <= 0) return state;
      return {
        ...state,
        anim: {
          move: invert(state.solution[state.solutionIdx - 1]),
          kind: "solution-back",
        },
      };
    }

    case "manualMove": {
      if (state.anim || state.playing) return state;
      // A manual turn invalidates the stored solution.
      return {
        ...state,
        solution: null,
        solutionIdx: 0,
        anim: { move: action.move, kind: "manual" },
      };
    }

    case "clearSolution":
      return { ...state, solution: null, solutionIdx: 0 };
  }
}

export default function RubikSolver() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const { facelets, anim, solution, solutionIdx, playing } = state;

  const [speedMs, setSpeedMs] = useState(300);
  const [solverReady, setSolverReady] = useState(false);
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("../lib/solver.worker.ts", import.meta.url)
    );
    workerRef.current = worker;
    worker.onmessage = (e: MessageEvent<SolverResponse>) => {
      const msg = e.data;
      if (msg.type === "ready") {
        setSolverReady(true);
      } else if (msg.type === "solution") {
        setSolving(false);
        const moves = parseAlg(msg.alg);
        if (moves.length > 0) dispatch({ type: "solutionReady", moves });
      } else if (msg.type === "error") {
        setSolving(false);
        setError(msg.message);
      }
    };
    worker.postMessage({ type: "init" });
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const onAnimComplete = useCallback(() => {
    dispatch({ type: "animComplete" });
  }, []);

  const solved = facelets === SOLVED_FACELETS;
  const busy = anim !== null || playing;
  const canStepForward = solution !== null && solutionIdx < solution.length;
  const canStepBack = solution !== null && solutionIdx > 0;

  const handleSolve = () => {
    if (!solverReady || solving || solved || busy) return;
    setError(null);
    dispatch({ type: "clearSolution" });
    setSolving(true);
    workerRef.current?.postMessage({ type: "solve", facelets });
  };

  const handleScramble = () => {
    if (solving) return;
    setError(null);
    dispatch({ type: "scrambled", facelets: scrambledFacelets() });
  };

  const handlePlayPause = () => {
    dispatch({ type: "playPause" });
  };

  const handleStepForward = () => {
    if (busy) return;
    dispatch({ type: "stepForward" });
  };

  const handleStepBack = () => {
    if (busy) return;
    dispatch({ type: "stepBack" });
  };

  const handleManualMove = (move: Move) => {
    if (busy || solving) return;
    dispatch({ type: "manualMove", move });
  };

  return (
    <div className="flex h-dvh flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80 px-6 py-4">
        <h1 className="text-lg font-bold tracking-tight">
          <Link href="/" className="transition-colors hover:text-emerald-400">
            Rubik Solver
          </Link>
        </h1>
        <p className="text-xs text-zinc-500">
          Kociemba two-phase solver · drag to orbit, scroll to zoom
        </p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative min-h-72 flex-1">
          <CubeCanvas
            facelets={facelets}
            anim={anim?.move ?? null}
            durationMs={speedMs}
            onAnimComplete={onAnimComplete}
          />
          {solved && !busy && (
            <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm font-semibold text-emerald-400 ring-1 ring-emerald-500/40">
              Solved!
            </div>
          )}
        </div>

        <aside className="flex w-full flex-col gap-3 overflow-y-auto border-t border-zinc-800/80 p-4 lg:w-96 lg:border-l lg:border-t-0">
          <ControlsPanel
            onSolve={handleSolve}
            onScramble={handleScramble}
            onPlayPause={handlePlayPause}
            onStepForward={handleStepForward}
            onStepBack={handleStepBack}
            speedMs={speedMs}
            onSpeedChange={setSpeedMs}
            playing={playing}
            solving={solving}
            solverReady={solverReady}
            solved={solved}
            busy={busy}
            hasSolution={solution !== null}
            canStepForward={canStepForward}
            canStepBack={canStepBack}
          />
          <SolutionDisplay solution={solution} solutionIdx={solutionIdx} />
          <ManualControls onMove={handleManualMove} disabled={busy || solving} />
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 ring-1 ring-red-500/30">
              Solver error: {error}
            </p>
          )}
        </aside>
      </main>
    </div>
  );
}
