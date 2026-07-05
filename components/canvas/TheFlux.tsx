"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { fluxFragmentShader, fluxVertexShader } from "./shaders/fluxShaders";
import { useFluxStore } from "@/store/useStore";

const VELOCITY_THRESHOLD = 2.4;
const REPULSION = 0.35;
const LERP_SPEED = 5;

export function TheFlux() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const rigidRef = useRef<RapierRigidBody>(null);
  const prevPointer = useRef(new THREE.Vector2());
  const velSmooth = useRef(0);
  const fractureSmooth = useRef(0);
  const { clock, scene } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDissolveProgress: { value: 0 },
      // Three/drei `Environment` sets `scene.environment` (a prefiltered cube texture).
      // We sample it in the fragment shader for high-contrast chrome reflections.
      uEnvMap: { value: null as unknown as THREE.Texture },
      uEnvMapEnabled: { value: 0 },
    }),
    [],
  );

  const scrollProgress = useFluxStore((s) => s.scrollProgress);
  const setPointerVelocity = useFluxStore((s) => s.setPointerVelocity);
  const setChromaticDrive = useFluxStore((s) => s.setChromaticDrive);
  const setFractureDissolve = useFluxStore((s) => s.setFractureDissolve);

  useFrame((state, delta) => {
    const t = clock.elapsedTime;
    const p = state.pointer;

    const dvx = (p.x - prevPointer.current.x) / Math.max(delta, 1e-4);
    const dvy = (p.y - prevPointer.current.y) / Math.max(delta, 1e-4);
    prevPointer.current.set(p.x, p.y);
    setPointerVelocity({ x: dvx, y: dvy });

    const speed = Math.hypot(dvx, dvy);
    velSmooth.current = THREE.MathUtils.lerp(velSmooth.current, speed, 1 - Math.exp(-delta * 8));
    const chroma = Math.min(1, velSmooth.current / 12);
    setChromaticDrive(chroma);

    const burst = Math.min(
      1,
      Math.max(0, (speed - VELOCITY_THRESHOLD) / 6),
    );
    fractureSmooth.current = THREE.MathUtils.lerp(
      fractureSmooth.current,
      burst,
      1 - Math.exp(-delta * 10),
    );
    setFractureDissolve(fractureSmooth.current);

    const dissolve = THREE.MathUtils.clamp(
      scrollProgress * 0.65 + fractureSmooth.current * 0.85,
      0,
      1,
    );

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uMouse.value.set(p.x, p.y);
      materialRef.current.uniforms.uDissolveProgress.value = dissolve;
      const hasEnv = !!scene.environment;
      materialRef.current.uniforms.uEnvMapEnabled.value = hasEnv ? 1 : 0;
      if (hasEnv) {
        materialRef.current.uniforms.uEnvMap.value = scene.environment as unknown as THREE.Texture;
      }
    }

    const target = new THREE.Vector3(-p.x * REPULSION, -p.y * REPULSION, 0);
    const rb = rigidRef.current;

    // TEMP VISIBILITY FIX: ensure the orb always renders even if dissolve becomes too strong.
    // (Will keep dissolve driving the look, but clamp to a safe range for visibility.)
    if (materialRef.current) {
      materialRef.current.uniforms.uDissolveProgress.value = THREE.MathUtils.clamp(
        dissolve,
        0.05,
        0.95,
      );
    }
    if (rb) {
      const tr = rb.translation();
      const cur = new THREE.Vector3(tr.x, tr.y, tr.z);
      cur.lerp(target, 1 - Math.exp(-delta * LERP_SPEED));
      rb.setNextKinematicTranslation({ x: cur.x, y: cur.y, z: cur.z });
    }
  });

  return (
    <RigidBody ref={rigidRef} type="kinematicPosition" colliders="ball">
      <Sphere args={[1.06, 96, 96]} castShadow receiveShadow scale={[1.02, 1.02, 1.02]}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={fluxVertexShader}
          fragmentShader={fluxFragmentShader}
          uniforms={uniforms}
        />
      </Sphere>
    </RigidBody>
  );
}
