"use client";

import dynamic from "next/dynamic";

const RubikSolver = dynamic(() => import("@/components/rubik-solver"), {
  ssr: false,
  loading: () => (
    <div className="flex h-dvh items-center justify-center bg-zinc-950 text-sm text-zinc-500">
      Loading cube…
    </div>
  ),
});

export default function SolveClient() {
  return <RubikSolver />;
}
