"use client";

import dynamic from "next/dynamic";

const HeroCube = dynamic(() => import("./hero-cube"), {
  ssr: false,
  loading: () => <HeroCubePlaceholder />,
});

function HeroCubePlaceholder() {
  return (
    <div className="h-full w-full">
      <div className="mx-auto h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_65%)]" />
    </div>
  );
}

export function HeroCubeIsland() {
  return <HeroCube />;
}
