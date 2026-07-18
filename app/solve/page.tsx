import type { Metadata } from "next";
import SolveClient from "./solve-client";

export const metadata: Metadata = {
  title: "Solve",
  description:
    "Scramble, solve, and step through every move of a Kociemba two-phase solution in 3D.",
};

export default function SolvePage() {
  return <SolveClient />;
}
