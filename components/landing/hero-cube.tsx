"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Cube from "cubejs";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Cube3D } from "@/components/cube-3d";
import { parseAlg, toNotation, type Move } from "@/lib/moves";
import { SOLVED_FACELETS } from "@/lib/cube-logic";
import { DEMO_SOLVES } from "@/lib/demo-solves";

const MOVE_MS = 420;
const INTER_MOVE_MS = 60;
const SCRAMBLED_PAUSE_MS = 1400;
const SOLVED_PAUSE_MS = 2600;

interface DemoSequence {
  moves: Move[];
  /** Facelet string before each move, plus the final (solved) state. */
  states: string[];
}

// Precomputed once per page load; this module is only ever loaded client-side
// (ssr: false island), so cubejs never runs on the server.
const SEQUENCES: DemoSequence[] = DEMO_SOLVES.map((pair) => {
  const cube = new Cube();
  cube.move(pair.scramble);
  const moves = parseAlg(pair.solution);
  const states = [cube.asString()];
  for (const move of moves) {
    cube.move(toNotation(move));
    states.push(cube.asString());
  }
  return { moves, states };
});

if (process.env.NODE_ENV !== "production") {
  for (const seq of SEQUENCES) {
    console.assert(
      seq.states[seq.states.length - 1] === SOLVED_FACELETS,
      "demo solve pair does not end on a solved cube"
    );
  }
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

/**
 * Demo cube for the landing hero: loops precomputed scramble -> solve pairs
 * on the real Cube3D. Facelets are read from the precomputed state sequence,
 * so the visuals always match the logical cube.
 */
export default function HeroCube() {
  const reducedMotion = usePrefersReducedMotion();

  const [pairIdx, setPairIdx] = useState(0);
  const [moveIdx, setMoveIdx] = useState(0);
  const [anim, setAnim] = useState<Move | null>(null);
  const [ready, setReady] = useState(false);

  const seq = SEQUENCES[pairIdx];
  const facelets = seq.states[Math.min(moveIdx, seq.states.length - 1)];

  const machineRef = useRef({ pairIdx: 0, moveIdx: 0 });
  // Set by the loop effect; called from onAnimComplete to keep the loop going.
  const continueRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (reducedMotion) return;

    let timeout: number | undefined;
    const sched = (fn: () => void, ms: number) => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(fn, ms);
    };

    const step = () => {
      const { pairIdx: p, moveIdx: m } = machineRef.current;
      const sequence = SEQUENCES[p];
      if (m < sequence.moves.length) {
        setAnim(sequence.moves[m]);
      } else {
        // Solved: hold the finished cube, then jump-cut to the next scramble
        sched(advance, SOLVED_PAUSE_MS);
      }
    };

    const advance = () => {
      const next = (machineRef.current.pairIdx + 1) % SEQUENCES.length;
      machineRef.current = { pairIdx: next, moveIdx: 0 };
      setPairIdx(next);
      setMoveIdx(0);
      sched(step, SCRAMBLED_PAUSE_MS);
    };

    const onVisibility = () => {
      if (document.hidden) window.clearTimeout(timeout);
      else sched(step, 800);
    };

    continueRef.current = () => sched(step, INTER_MOVE_MS);
    document.addEventListener("visibilitychange", onVisibility);
    sched(step, SCRAMBLED_PAUSE_MS);

    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("visibilitychange", onVisibility);
      continueRef.current = () => {};
    };
  }, [reducedMotion]);

  const onAnimComplete = useCallback(() => {
    machineRef.current.moveIdx += 1;
    setMoveIdx(machineRef.current.moveIdx);
    setAnim(null);
    continueRef.current();
  }, []);

  return (
    <div
      className={`h-full w-full transition-opacity duration-700 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <Canvas
        camera={{ position: [4.4, 3.8, 5.4], fov: 38 }}
        dpr={[1, 1.5]}
        onCreated={() => setReady(true)}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[6, 8, 5]} intensity={1.4} />
        <directionalLight position={[-6, -3, -6]} intensity={0.5} />
        <Cube3D
          facelets={facelets}
          anim={anim}
          durationMs={MOVE_MS}
          onAnimComplete={onAnimComplete}
        />
        <OrbitControls
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.6}
          enableZoom={false}
          enablePan={false}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
