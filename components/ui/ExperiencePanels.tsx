"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Orbit, Sparkles, Ticket } from "lucide-react";

const cards = [
  {
    key: "hero",
    label: "01 / Signal",
    title: "Liquid chrome horizon",
    description:
      "The orb reacts to your gestures, creating a living pulse that shifts from molten metal to particle haze.",
    target: 0.12,
    icon: Sparkles,
    chips: ["Gesture reactive", "Chrome bloom", "Intro pulse"],
  },
  {
    key: "experience",
    label: "02 / Atmosphere",
    title: "Reactive particle field",
    description:
      "A denser halo of points and layered motion turns the scene into a living event environment.",
    target: 0.5,
    icon: Orbit,
    chips: ["24k particles", "Depth layers", "Crowd energy"],
  },
  {
    key: "tickets",
    label: "03 / Access",
    title: "Reserved entry flow",
    description:
      "The experience opens into a premium, cinematic entry state designed for high-energy launches.",
    target: 1,
    icon: Ticket,
    chips: ["Priority entry", "Cinematic payoff", "Fast flow"],
  },
] as const;

type Props = {
  activeStage: "hero" | "experience" | "tickets";
  onSelect: (target: number) => void;
};

export function ExperiencePanels({ activeStage, onSelect }: Props) {
  return (
    <div className="mt-10 w-full max-w-5xl rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#E4FF00]/70">
            Live layers
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white/90 md:text-2xl">
            A richer portal for every interaction.
          </h2>
        </div>
        <div className="rounded-full border border-white/10 bg-[#0A0A0C]/50 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/45">
          Motion + particles + atmosphere
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const isActive = activeStage === card.key;

          return (
            <motion.button
              key={card.key}
              type="button"
              onClick={() => onSelect(card.target)}
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              className={`group rounded-[1.35rem] border p-4 text-left transition ${
                isActive
                  ? "border-[#E4FF00]/50 bg-[#E4FF00]/12"
                  : "border-white/10 bg-[#0A0A0C]/45"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.35em] text-white/45">
                  {card.label}
                </span>
                <div className="rounded-full border border-white/10 p-2 text-[#E4FF00]">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white/90">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">{card.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {card.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-white/45"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.25em] text-[#E4FF00]/80">
                Launch state
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28 }}
          className="mt-4 rounded-[1.2rem] border border-white/10 bg-[#0A0A0C]/60 p-4"
        >
          {activeStage === "hero" && (
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
                  Current state
                </p>
                <p className="mt-2 text-sm text-white/70">
                  The orb starts in its liquid form before shifting into a particle storm as you move, giving the first impression a layered, cinematic pulse.
                </p>
              </div>
              <div className="rounded-full border border-[#E4FF00]/20 bg-[#E4FF00]/10 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-[#E4FF00]/80">
                Interactive intro
              </div>
            </div>
          )}

          {activeStage === "experience" && (
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
                  Atmosphere boost
                </p>
                <p className="mt-2 text-sm text-white/70">
                  The particle cloud deepens, the halo brightens, and the environment becomes more cinematic with a stronger sense of motion and scale.
                </p>
              </div>
              <div className="rounded-full border border-[#E4FF00]/20 bg-[#E4FF00]/10 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-[#E4FF00]/80">
                24k particle field
              </div>
            </div>
          )}

          {activeStage === "tickets" && (
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
                  Event access
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Your journey now completes in a premium-ready state with sharper motion, more confidence, and a more polished event entry feel.
                </p>
              </div>
              <div className="rounded-full border border-[#E4FF00]/20 bg-[#E4FF00]/10 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-[#E4FF00]/80">
                reserved entry
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
