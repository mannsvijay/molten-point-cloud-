"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#lineup", label: "Lineup" },
  { href: "#experience", label: "Experience" },
  { href: "#tickets", label: "Tickets" },
];

export function OrbitalNav() {
  const containerRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 220, damping: 24, mass: 0.35 });
  const smy = useSpring(my, { stiffness: 220, damping: 24, mass: 0.35 });

  const spotlight = useMotionTemplate`radial-gradient(120px 120px at ${smx}px ${smy}px, rgba(228,255,0,0.14), transparent 70%)`;

  const onMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    },
    [mx, my],
    
  );

  const onLeave = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(r.width / 2);
    my.set(r.height / 2);
  }, [mx, my]);

  return (
    <motion.nav
      ref={containerRef}
      className={cn(
        "glass-panel relative overflow-hidden rounded-full px-2 py-2",
        "pointer-events-auto",
      )}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.2 }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ background: spotlight }}
      />
      <ul className="relative z-10 flex items-center gap-1">
        {links.map((item) => (
          <li key={item.href}>
            <MagneticLink href={item.href} label={item.label} />

          </li>
        ))}
      </ul>
    </motion.nav>
  );
}

function MagneticLink({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 420, damping: 28, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 420, damping: 28, mass: 0.35 });

  const handleMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className="relative inline-block rounded-full px-5 py-2 text-sm font-medium uppercase tracking-[0.22em] text-[#E4FF00]/90"
      style={{ x: sx, y: sy }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileTap={{ scale: 0.96 }}
    >
      <span className="relative z-10">{label}</span>
    </motion.a>
  );
}
