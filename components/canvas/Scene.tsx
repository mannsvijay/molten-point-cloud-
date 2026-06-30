"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { TheFlux } from "./TheFlux";
import { ParticleCloud } from "./ParticleCloud";
import { PostProcessing } from "./PostProcessing";
import { Environment } from "@react-three/drei";

export function Scene() {
  return (
    <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden pointer-events-none">
      <Canvas
        className="h-full w-full touch-none"
        style={{ pointerEvents: "auto", display: "block" }}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0A0A0C", 1);
        }}
      >
        <color attach="background" args={["#0A0A0C"]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 5]} intensity={1.25} color="#E4FF00" />
        <directionalLight position={[-5, -2, -3]} intensity={0.35} color="#FF5F1F" />

        {/* Dramatic reflections for liquid/oxidized chrome. */}
        <Environment preset="studio" />

        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]}>
            <TheFlux />
          </Physics>
          <ParticleCloud />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
