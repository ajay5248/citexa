"use client";

import { usePathname } from "next/navigation";
import { CinematicParticleScene } from "@/components/3d/CinematicParticleScene";

export function BackgroundWrapper() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <CinematicParticleScene showCurves={pathname !== "/"} />
    </div>
  );
}
