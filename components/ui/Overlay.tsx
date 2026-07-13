"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
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
  const detailPills = [
    { label: "Location", value: "North Hall", icon: MapPin },
    { label: "Doors", value: "18:30", icon: CalendarDays },
    { label: "Vibe", value: "Immersive audio", icon: Sparkles },
  ];

  const handleStageSelect = (target: number) => {
    setScrollProgress(target);
    setActiveStage(stageFromProgress(target));
  };

  return (
    <div
      ref={surfaceRef}
      className="relative z-10 flex min-h-screen flex-col pointer-events-none"
    >
      <header className="flex flex-wrap items-start justify-between gap-6 p-6 md:p-10">
        <div className="pointer-events-auto space-y-3">
          <div className="text-xs uppercase tracking-[0.4em] text-white/40">
            Chromatic Flux
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-white/55 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[#E4FF00]" />
            Live launch • 08 Jul 2026
          </div>
        </div>
        <div className="pointer-events-auto flex flex-col items-end gap-3">
          <OrbitalNav />
          <div className="flex items-center gap-2 rounded-full border border-[#E4FF00]/20 bg-[#E4FF00]/10 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[#E4FF00]/80">
            <CalendarDays className="h-3.5 w-3.5" />
            North Hall • 9:30 PM
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-end px-6 pb-16 md:px-14 md:pb-24">
        <div className="max-w-5xl">
          <HeroTypography />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {detailPills.map((pill) => {
            const Icon = pill.icon;
            return (
              <div
                key={pill.label}
                className="rounded-full border border-white/10 bg-[#0A0A0C]/50 px-4 py-2 backdrop-blur"
              >
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/45">
                  <Icon className="h-3.5 w-3.5 text-[#E4FF00]" />
                  {pill.label}
                </div>
                <div className="mt-1 text-sm font-medium text-white/80">{pill.value}</div>
              </div>
            );
          })}
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
