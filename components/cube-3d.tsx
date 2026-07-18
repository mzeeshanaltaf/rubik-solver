"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { axisOf, type Face, type Move } from "@/lib/moves";
import {
  CUBIE_POSITIONS,
  getStickerMap,
  STICKER_COLORS,
  stickerKey,
  type Vec3,
} from "@/lib/cube-logic";

/** Sign of a clockwise quarter turn around the face's world axis. */
const CW_SIGN: Record<Face, 1 | -1> = {
  U: -1,
  R: -1,
  F: -1,
  D: 1,
  L: 1,
  B: 1,
};

const LAYER: Record<Face, { axis: 0 | 1 | 2; value: 1 | -1 }> = {
  U: { axis: 1, value: 1 },
  D: { axis: 1, value: -1 },
  R: { axis: 0, value: 1 },
  L: { axis: 0, value: -1 },
  F: { axis: 2, value: 1 },
  B: { axis: 2, value: -1 },
};

/** Total signed rotation for a move; primes animate as -90°, not +270°. */
function targetAngle(move: Move): number {
  const cw = CW_SIGN[move.face] * (Math.PI / 2);
  if (move.turns === 2) return cw * 2;
  if (move.turns === 3) return -cw;
  return cw;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const SPACING = 1.03;

const STICKER_NORMALS: { normal: Vec3; rotation: [number, number, number] }[] = [
  { normal: [1, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { normal: [-1, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  { normal: [0, 1, 0], rotation: [-Math.PI / 2, 0, 0] },
  { normal: [0, -1, 0], rotation: [Math.PI / 2, 0, 0] },
  { normal: [0, 0, 1], rotation: [0, 0, 0] },
  { normal: [0, 0, -1], rotation: [0, Math.PI, 0] },
];

function Cubie({
  pos,
  stickers,
}: {
  pos: Vec3;
  stickers: Record<string, Face>;
}) {
  return (
    <group position={[pos[0] * SPACING, pos[1] * SPACING, pos[2] * SPACING]}>
      <RoundedBox args={[0.97, 0.97, 0.97]} radius={0.07} smoothness={4}>
        <meshStandardMaterial color="#0a0a0a" roughness={0.35} />
      </RoundedBox>
      {STICKER_NORMALS.map(({ normal, rotation }) => {
        // Only faces on the outside of the cube carry a sticker
        if (
          normal[0] * pos[0] !== 1 &&
          normal[1] * pos[1] !== 1 &&
          normal[2] * pos[2] !== 1
        ) {
          return null;
        }
        const color = stickers[stickerKey(pos, normal)];
        if (!color) return null;
        return (
          <mesh
            key={normal.join(",")}
            position={[normal[0] * 0.487, normal[1] * 0.487, normal[2] * 0.487]}
            rotation={rotation}
          >
            <planeGeometry args={[0.82, 0.82]} />
            <meshStandardMaterial
              color={STICKER_COLORS[color]}
              roughness={0.25}
              metalness={0.05}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function Cube3D({
  facelets,
  anim,
  durationMs,
  onAnimComplete,
}: {
  facelets: string;
  anim: Move | null;
  durationMs: number;
  onAnimComplete: () => void;
}) {
  const stickers = useMemo(() => getStickerMap(facelets), [facelets]);
  const pivot = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const done = useRef(false);

  useLayoutEffect(() => {
    progress.current = 0;
    done.current = false;
    pivot.current?.rotation.set(0, 0, 0);
  }, [anim]);

  useFrame((_, delta) => {
    if (!anim || done.current || !pivot.current) return;
    const duration = ((anim.turns === 2 ? 1.5 : 1) * durationMs) / 1000;
    progress.current = Math.min(1, progress.current + delta / duration);
    const angle = targetAngle(anim) * easeInOutCubic(progress.current);
    pivot.current.rotation.set(0, 0, 0);
    pivot.current.rotation[axisOf(anim.face)] = angle;
    if (progress.current >= 1) {
      done.current = true;
      onAnimComplete();
    }
  });

  const layer = anim ? LAYER[anim.face] : null;
  const rotating: Vec3[] = [];
  const still: Vec3[] = [];
  for (const pos of CUBIE_POSITIONS) {
    if (layer && pos[layer.axis] === layer.value) rotating.push(pos);
    else still.push(pos);
  }

  return (
    <group>
      <group ref={pivot}>
        {rotating.map((pos) => (
          <Cubie key={pos.join(",")} pos={pos} stickers={stickers} />
        ))}
      </group>
      {still.map((pos) => (
        <Cubie key={pos.join(",")} pos={pos} stickers={stickers} />
      ))}
    </group>
  );
}
