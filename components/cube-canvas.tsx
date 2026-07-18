"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Move } from "@/lib/moves";
import { Cube3D } from "./cube-3d";

export function CubeCanvas({
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
  return (
    <Canvas camera={{ position: [4.4, 3.8, 5.4], fov: 38 }} dpr={[1, 2]}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[6, 8, 5]} intensity={1.4} />
      <directionalLight position={[-6, -3, -6]} intensity={0.5} />
      <Cube3D
        facelets={facelets}
        anim={anim}
        durationMs={durationMs}
        onAnimComplete={onAnimComplete}
      />
      <OrbitControls
        enablePan={false}
        minDistance={5.5}
        maxDistance={16}
        makeDefault
      />
    </Canvas>
  );
}
