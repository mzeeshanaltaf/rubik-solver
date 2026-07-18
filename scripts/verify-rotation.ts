/**
 * Verifies that the visual rotation convention in cube-3d.tsx (axis + sign per
 * face) produces exactly the same sticker layout as cubejs's logical moves.
 * Run: npx tsx scripts/verify-rotation.ts
 */
import Cube from "cubejs";
import { getStickerMap, stickerKey, type Vec3 } from "../lib/cube-logic";
import { axisOf, parseMove, toNotation, type Face, type Move } from "../lib/moves";

// Mirror of the constants in components/cube-3d.tsx
const CW_SIGN: Record<Face, 1 | -1> = { U: -1, R: -1, F: -1, D: 1, L: 1, B: 1 };
const LAYER: Record<Face, { axis: 0 | 1 | 2; value: 1 | -1 }> = {
  U: { axis: 1, value: 1 },
  D: { axis: 1, value: -1 },
  R: { axis: 0, value: 1 },
  L: { axis: 0, value: -1 },
  F: { axis: 2, value: 1 },
  B: { axis: 2, value: -1 },
};
function targetAngle(move: Move): number {
  const cw = CW_SIGN[move.face] * (Math.PI / 2);
  if (move.turns === 2) return cw * 2;
  if (move.turns === 3) return -cw;
  return cw;
}

function rotate(v: Vec3, axis: "x" | "y" | "z", angle: number): Vec3 {
  const c = Math.round(Math.cos(angle));
  const s = Math.round(Math.sin(angle));
  const [x, y, z] = v;
  if (axis === "x") return [x, y * c - z * s, y * s + z * c];
  if (axis === "y") return [x * c + z * s, y, -x * s + z * c];
  return [x * c - y * s, x * s + y * c, z];
}

const scramble = "R U F' L2 D B U2 R' D' F B2 L";
const base = new Cube();
base.move(scramble);
const before = getStickerMap(base.asString());

const allMoves = ("UDLRFB".split("") as Face[]).flatMap((f) =>
  [f, `${f}'`, `${f}2`].map(parseMove)
);

let failures = 0;
for (const move of allMoves) {
  const layer = LAYER[move.face];
  const angle = targetAngle(move);
  const axis = axisOf(move.face);

  // Predict: geometrically rotate every sticker in the turning layer
  const predicted: Record<string, string> = {};
  for (const [key, color] of Object.entries(before)) {
    const [posStr, normalStr] = key.split("|");
    const pos = posStr.split(",").map(Number) as Vec3;
    const normal = normalStr.split(",").map(Number) as Vec3;
    if (pos[layer.axis] === layer.value) {
      predicted[stickerKey(rotate(pos, axis, angle), rotate(normal, axis, angle))] = color;
    } else {
      predicted[key] = color;
    }
  }

  // Actual: cubejs applies the move logically
  const cube = Cube.fromString(base.asString());
  cube.move(toNotation(move));
  const actual = getStickerMap(cube.asString());

  const mismatches = Object.keys(actual).filter((k) => actual[k] !== predicted[k]);
  if (mismatches.length > 0) {
    failures++;
    console.error(`FAIL ${toNotation(move)}: ${mismatches.length} sticker mismatches`);
  } else {
    console.log(`ok   ${toNotation(move)}`);
  }
}

// Also sanity-check the solver round-trip
Cube.initSolver();
const solveMe = Cube.fromString(base.asString());
const solution = solveMe.solve();
solveMe.move(solution);
console.log(`solver: "${scramble}" -> "${solution}" -> solved=${solveMe.isSolved()}`);
if (!solveMe.isSolved()) failures++;

process.exit(failures === 0 ? 0 : 1);
