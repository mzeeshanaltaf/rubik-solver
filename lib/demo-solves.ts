/**
 * Precomputed scramble/solution pairs for the landing-page hero cube.
 * Generated once with cubejs (`Cube.initSolver()` + `solve()`), so the landing
 * page can loop real Kociemba solutions without paying the ~4 s solver init.
 * Each pair is verified: applying scramble then solution yields the solved cube.
 */
export interface DemoSolve {
  /** Space-separated scramble in standard notation */
  scramble: string;
  /** Space-separated Kociemba two-phase solution */
  solution: string;
}

export const DEMO_SOLVES: DemoSolve[] = [
  {
    scramble:
      "R D L2 D2 B2 D2 B F R2 L' B F2 D' L R U2 D' B2 F2 U F' D F2 B' U2",
    solution: "F' U' R L' D' B' R2 F' R' B U' R2 B2 L2 U L2 U2 R2 B2 D L2 B2",
  },
  {
    scramble:
      "L' F R L2 F' B' L R' U F' R' L' U2 R D' U2 B' R' F R2 F' B2 R2 F2 R'",
    solution: "R' D2 B2 L' U D L B U F2 D2 B2 U2 D L2 U' R2 L2 F2 U' R2",
  },
  {
    scramble:
      "F' D' R2 U D2 R2 B2 D F R' F' D R2 L' B' L2 U' B' D' U2 B L R' B2 D",
    solution: "F2 B2 R' F' U' B2 R' F' U R2 U' R2 U2 B2 D' B2 U R2 F2 U R2 D'",
  },
];
