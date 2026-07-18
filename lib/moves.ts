export type Face = "U" | "D" | "L" | "R" | "F" | "B";
export type Axis = "x" | "y" | "z";

export interface Move {
  face: Face;
  /** Clockwise quarter turns: 1 = CW, 2 = half turn, 3 = CCW (prime) */
  turns: 1 | 2 | 3;
}

export const FACES: Face[] = ["U", "D", "L", "R", "F", "B"];

const FACE_AXIS: Record<Face, Axis> = {
  U: "y",
  D: "y",
  L: "x",
  R: "x",
  F: "z",
  B: "z",
};

export function axisOf(face: Face): Axis {
  return FACE_AXIS[face];
}

export function parseMove(s: string): Move {
  const face = s[0] as Face;
  const suffix = s.slice(1);
  const turns: Move["turns"] = suffix === "2" ? 2 : suffix === "'" ? 3 : 1;
  return { face, turns };
}

export function parseAlg(alg: string): Move[] {
  return alg.trim().split(/\s+/).filter(Boolean).map(parseMove);
}

export function toNotation(m: Move): string {
  return m.face + (m.turns === 2 ? "2" : m.turns === 3 ? "'" : "");
}

export function invert(m: Move): Move {
  return { face: m.face, turns: m.turns === 2 ? 2 : m.turns === 1 ? 3 : 1 };
}

export function randomScramble(length = 25): Move[] {
  const moves: Move[] = [];
  while (moves.length < length) {
    const face = FACES[Math.floor(Math.random() * FACES.length)];
    const prev = moves[moves.length - 1];
    const prev2 = moves[moves.length - 2];
    if (prev && prev.face === face) continue;
    // Avoid a third consecutive turn on the same axis (e.g. R L R)
    if (
      prev &&
      prev2 &&
      axisOf(prev.face) === axisOf(face) &&
      axisOf(prev2.face) === axisOf(face)
    ) {
      continue;
    }
    const turns = ([1, 2, 3] as const)[Math.floor(Math.random() * 3)];
    moves.push({ face, turns });
  }
  return moves;
}
