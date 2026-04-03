"use client";

import dynamic from "next/dynamic";
import { Overlay } from "@/components/ui/Overlay";

const Scene = dynamic(
  () => import("@/components/canvas/Scene").then((m) => m.Scene),
  { ssr: false },
);

export function Experience() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-void">
      <Scene />
      <Overlay />
    </div>
  );
}
