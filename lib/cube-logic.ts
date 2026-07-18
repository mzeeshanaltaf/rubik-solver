import type { Face } from "./moves";

/** Facelet string of a solved cube, in cubejs/Kociemba order: U R F D L B. */
export const SOLVED_FACELETS =
  "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";

/** Classic Rubik's color scheme: white up, green front, red right. */
export const STICKER_COLORS: Record<Face, string> = {
  U: "#f5f5f5",
  D: "#ffd500",
  F: "#009e60",
  B: "#0051ba",
  R: "#c41e3a",
  L: "#ff5800",
};

export type Vec3 = [number, number, number];

interface FaceletDef {
  pos: Vec3;
  normal: Vec3;
}

// Each face's 9 facelets appear row-major in the Kociemba string. `at(row, col)`
// maps a row/col to the cubie grid position ({-1,0,1}^3) holding that sticker.
const FACE_DEFS: { normal: Vec3; at: (r: number, c: number) => Vec3 }[] = [
  { normal: [0, 1, 0], at: (r, c) => [c - 1, 1, r - 1] }, // U
  { normal: [1, 0, 0], at: (r, c) => [1, 1 - r, 1 - c] }, // R
  { normal: [0, 0, 1], at: (r, c) => [c - 1, 1 - r, 1] }, // F
  { normal: [0, -1, 0], at: (r, c) => [c - 1, -1, 1 - r] }, // D
  { normal: [-1, 0, 0], at: (r, c) => [-1, 1 - r, c - 1] }, // L
  { normal: [0, 0, -1], at: (r, c) => [1 - c, 1 - r, -1] }, // B
];

const FACELET_MAP: FaceletDef[] = FACE_DEFS.flatMap(({ normal, at }) => {
  const defs: FaceletDef[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      defs.push({ pos: at(r, c), normal });
    }
  }
  return defs;
});

export function stickerKey(pos: Vec3, normal: Vec3): string {
  return `${pos.join(",")}|${normal.join(",")}`;
}

/**
 * Maps every visible sticker (cubie position + outward normal) to its color
 * letter, derived from a 54-char facelet string.
 */
export function getStickerMap(facelets: string): Record<string, Face> {
  const map: Record<string, Face> = {};
  for (let i = 0; i < FACELET_MAP.length; i++) {
    const { pos, normal } = FACELET_MAP[i];
    map[stickerKey(pos, normal)] = facelets[i] as Face;
  }
  return map;
}

/** All 26 visible cubie grid positions (the hidden core is skipped). */
export const CUBIE_POSITIONS: Vec3[] = (() => {
  const positions: Vec3[] = [];
  for (const x of [-1, 0, 1]) {
    for (const y of [-1, 0, 1]) {
      for (const z of [-1, 0, 1]) {
        if (x === 0 && y === 0 && z === 0) continue;
        positions.push([x, y, z]);
      }
    }
  }
  return positions;
})();
