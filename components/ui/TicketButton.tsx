"use client";

import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  href?: string;
};

export function TicketButton({ className, href = "#tickets" }: Props) {
  return (
    <motion.a
      href={href}
      className={cn(
        "glass-cta inline-flex items-center gap-3 rounded-full px-8 py-3",
        "font-semibold uppercase tracking-[0.2em] text-[#0A0A0C]",
        "pointer-events-auto",
        className,
      )}
      whileHover={{
        scale: 1.06,
        transition: { type: "spring", stiffness: 520, damping: 18 },
      }}
      whileTap={{
        scale: 0.94,
        transition: { type: "spring", stiffness: 600, damping: 22 },
      }}
    >
      <motion.span
        className="inline-flex"
        animate={{ rotate: [0, -4, 4, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        <Ticket className="h-5 w-5" strokeWidth={2.25} />
      </motion.span>
      <span className="flex flex-col items-start leading-none">
        <span>Reserve tickets</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#0A0A0C]/70">
          Priority access
        </span>
      </span>
    </motion.a>
  );
}
