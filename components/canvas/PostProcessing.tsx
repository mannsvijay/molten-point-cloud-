"use client";

import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo } from "react";
import * as THREE from "three";
import { useFluxStore } from "@/store/useStore";

export function PostProcessing() {
  const offset = useMemo(() => new THREE.Vector2(0.001, 0.001), []);

  useFrame(() => {
    const d = useFluxStore.getState().chromaticDrive;
    offset.set(0.0008 + d * 0.028, 0.0006 + d * 0.022);
  });

  return (
    <EffectComposer multisampling={0}>
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={offset}
        radialModulation={false}
        modulationOffset={0.15}
      />
      <Vignette
        blendFunction={BlendFunction.NORMAL}
        eskil={false}
        offset={0.35}
        darkness={0.55}
      />
    </EffectComposer>
  );
}
