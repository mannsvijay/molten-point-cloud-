"use client";


import { motion } from "framer-motion";

const line1 = "CHROMATIC";
const line2 = "FLUX";

export function HeroTypography() {
  return (
    <div className="pointer-events-none select-none">
      <div className="flex flex-wrap">
        {line1.split("").map((ch, i) => (
          <motion.span
            key={`l1-${i}`}
            className="inline-block font-hero text-[clamp(3.5rem,12vw,9rem)] leading-[0.92] tracking-tight text-[#E4FF00]"
            initial={{ y: 120, opacity: 0, rotateX: -25 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{
              type: "spring",
              stiffness: 210,
              damping: 22,
              mass: 0.85,
              delay: 0.04 * i,
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap">
        {line2.split("").map((ch, i) => (
          <motion.span
            key={`l2-${i}`}
            className="inline-block font-hero text-[clamp(3.5rem,12vw,9rem)] leading-[0.92] tracking-tight text-white/90"
            initial={{ y: 140, opacity: 0, rotateX: 28 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 23,
              mass: 0.9,
              delay: 0.28 + 0.04 * i,
            }}
          >
            {ch}
          </motion.span>
        ))}
      </div>
      <motion.p
        className="mt-8 max-w-xl text-sm uppercase tracking-[0.35em] text-white/45"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        The molten point cloud — a liquid chrome event horizon.
      </motion.p>
    </div>
  );
}
