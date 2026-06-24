import React from "react";
import { motion } from "motion/react";

interface ProgressBarProps {
  /** 1-based position within the current level (matches the nav counter). */
  current: number;
  total: number;
}

// Reflects the ACTIVE LEVEL's position, not the global slide index — so it agrees
// with the level counter in the nav/header instead of fighting it. A soft glow
// head marks the leading edge.
export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  return (
    <div className="fixed bottom-0 left-0 w-full h-[3px] bg-outline-variant/15 z-50">
      <motion.div
        className="relative h-full hero-gradient"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white/90 shadow-glow" />
      </motion.div>
    </div>
  );
};
