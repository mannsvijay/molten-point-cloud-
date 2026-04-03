import { create } from "zustand";

export type MatterState = "liquid" | "dissolving" | "point_cloud";

export function matterStateFromProgress(p: number): MatterState {
  if (p < 0.33) return "liquid";
  if (p < 0.66) return "dissolving";
  return "point_cloud";
}

export interface FluxState {
  /** Scroll-driven journey through the experience (0 = liquid dominance, 1 = particle cloud). */
  scrollProgress: number;
  setScrollProgress: (value: number) => void;
  /** Normalized pointer velocity (NDC / sec, roughly) for post & fracture cues. */
  pointerVelocity: { x: number; y: number };
  setPointerVelocity: (v: { x: number; y: number }) => void;
  /** Smoothed magnitude used for chromatic aberration (0–1). */
  chromaticDrive: number;
  setChromaticDrive: (n: number) => void;
  /** Extra dissolve from fast cursor movement (0–1). */
  fractureDissolve: number;
  setFractureDissolve: (n: number) => void;
  getMatterState: () => MatterState;
}

const useFluxStore = create<FluxState>((set, get) => ({
  scrollProgress: 0,
  setScrollProgress: (value) =>
    set({ scrollProgress: Math.min(1, Math.max(0, value)) }),
  pointerVelocity: { x: 0, y: 0 },
  setPointerVelocity: (v) => set({ pointerVelocity: v }),
  chromaticDrive: 0,
  setChromaticDrive: (n) => set({ chromaticDrive: Math.min(1, Math.max(0, n)) }),
  fractureDissolve: 0,
  setFractureDissolve: (n) => set({ fractureDissolve: Math.min(1, Math.max(0, n)) }),
  getMatterState: () => matterStateFromProgress(get().scrollProgress),
}));

/** Primary store hook for the experience. */
export { useFluxStore };

/** Alias matching `store/useStore` naming conventions. */
export const useStore = useFluxStore;
