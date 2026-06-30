"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFluxStore } from "@/store/useStore";
import { OrbitalNav } from "./OrbitalNav";
import { HeroTypography } from "./HeroTypography";
import { TicketButton } from "./TicketButton";
import { ExperiencePanels } from "./ExperiencePanels";

const WHEEL_SENS = 0.00085;

type Stage = "hero" | "experience" | "tickets";

function stageFromProgress(progress: number): Stage {
  if (progress < 0.33) return "hero";
  if (progress < 0.66) return "experience";
  return "tickets";
}

export function Overlay() {
  const scrollProgress = useFluxStore((s) => s.scrollProgress);
  const setScrollProgress = useFluxStore((s) => s.setScrollProgress);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<Stage>("hero");

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { scrollProgress: p, setScrollProgress: set } = useFluxStore.getState();
      const next = Math.min(1, Math.max(0, p + e.deltaY * WHEEL_SENS));
      set(next);
      setActiveStage(stageFromProgress(next));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    setActiveStage(stageFromProgress(scrollProgress));
  }, [scrollProgress]);

  const progressLabel = useMemo(() => `${(scrollProgress * 100).toFixed(1)}%`, [scrollProgress]);

  const handleStageSelect = (target: number) => {
    setScrollProgress(target);
    setActiveStage(stageFromProgress(target));
  };

  return (
    <div
      ref={surfaceRef}
      className="relative z-10 flex min-h-screen flex-col pointer-events-none"
    >
      <header className="flex items-start justify-between gap-6 p-6 md:p-10">
        <div className="pointer-events-auto text-xs uppercase tracking-[0.4em] text-white/40">
          Chromatic Flux
        </div>
        <div className="pointer-events-auto">
          <OrbitalNav />
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-end px-6 pb-16 md:px-14 md:pb-24">
        <div className="max-w-5xl">
          <HeroTypography />
        </div>

        <div className="mt-10 max-w-5xl">
          <ExperiencePanels activeStage={activeStage} onSelect={handleStageSelect} />
        </div>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-8">
          <div className="pointer-events-auto">
            <TicketButton />
          </div>
          <div className="pointer-events-auto text-right text-[10px] uppercase tracking-[0.35em] text-white/35">
            <span className="block text-[#E4FF00]/80">State of matter</span>
            <span className="mt-2 block font-mono text-white/50">{progressLabel}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
