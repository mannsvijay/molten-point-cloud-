"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useRef, useEffect } from "react";
import { useFluxStore } from "@/store/useStore";
import { TheFlux } from "./TheFlux";
import { ParticleCloud } from "./ParticleCloud";
import { PostProcessing } from "./PostProcessing";
import { Environment } from "@react-three/drei";
import type { Camera } from "three";

function ScrollCamera() {
  const cameraRef = useRef<Camera>(null);
  const scrollProgress = useFluxStore((s) => s.scrollProgress);

  useFrame(({ camera }) => {
    // Smooth camera rotation based on scroll progress
    const rotX = scrollProgress * Math.PI * 0.3; // Rotate up to 0.3π
    const rotY = scrollProgress * Math.PI * 0.2;
    const zoom = 1 + scrollProgress * 0.4; // Slight zoom as you scroll

    camera.position.z = 3.4 / zoom;
    camera.position.y = scrollProgress * 1.2;
    camera.rotation.x = rotX;
    camera.rotation.y = rotY;
  });

  return null;
}

export function Scene() {
  return (
    <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden pointer-events-none">
      <Canvas
        className="h-full w-full touch-none"
        style={{ pointerEvents: "auto", display: "block" }}
        camera={{ position: [0, 0, 3.4], fov: 44 }}
        dpr={[1, 2]}
        frameloop="always"
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0A0A0C", 1);
        }}
      >
        <color attach="background" args={["#0A0A0C"]} />
        <ambientLight intensity={0.5} />
        <hemisphereLight intensity={0.9} color="#fdf3c7" groundColor="#05050a" />
        <pointLight position={[0, 0, 3.4]} intensity={2.2} color="#E4FF00" distance={8} />
        <pointLight position={[0, 0, -2.8]} intensity={1.1} color="#FF5F1F" distance={6} />
        <directionalLight position={[4, 6, 5]} intensity={1.45} color="#E4FF00" />
        <directionalLight position={[-5, -2, -3]} intensity={0.45} color="#FF5F1F" />

        {/* Dramatic reflections for liquid/oxidized chrome. */}
        <Environment preset="studio" />

        <Suspense fallback={null}>
          <ScrollCamera />
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
