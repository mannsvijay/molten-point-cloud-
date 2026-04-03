"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  particleFragmentShader,
  particleVertexShader,
} from "./shaders/particleShaders";
import { useFluxStore } from "@/store/useStore";

const COUNT = 12000;

export function ParticleCloud() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const scrollProgress = useFluxStore((s) => s.scrollProgress);
  const fractureDissolve = useFluxStore((s) => s.fractureDissolve);

  const { geometry, uniforms } = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(1.08, 4);
    const pos = base.attributes.position as THREE.BufferAttribute;
    const n = Math.min(COUNT, pos.count);
    const positions = new Float32Array(n * 3);
    const phases = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const j = Math.floor(Math.random() * pos.count);
      positions[i * 3] = pos.getX(j);
      positions[i * 3 + 1] = pos.getY(j);
      positions[i * 3 + 2] = pos.getZ(j);
      phases[i] = Math.random();
    }
    base.dispose();

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const u = {
      uTime: { value: 0 },
      uPointScale: { value: 1.2 },
      uDissolveProgress: { value: 0 },
    };
    return { geometry: geo, uniforms: u };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const dissolve = THREE.MathUtils.clamp(
      scrollProgress * 0.55 + fractureDissolve * 0.9,
      0,
      1,
    );
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uDissolveProgress.value = dissolve;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
