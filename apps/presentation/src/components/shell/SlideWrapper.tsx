import React from "react";
import { motion, useReducedMotion } from "motion/react";

/** How one slide change relates to the last — drives the transition's spatial feel. */
export type SlideTransition = "forward" | "back" | "in" | "out";

interface SlideWrapperProps {
  children: React.ReactNode;
  isActive: boolean;
  /** forward/back = lateral glide; in = push into the selected card; out = pull back. */
  transition?: SlideTransition;
  key?: React.Key;
}

// The deck's core metaphor is spatial zoom across an org map. Motion encodes it:
// lateral moves glide horizontally by direction; zooming a level in pushes the new
// surface forward (settles from slightly large), zooming out pulls back (settles
// from slightly small) — so the hierarchy *feels* navigable, not like flat slides.
const VARIANTS: Record<SlideTransition, { initial: any; exit: any }> = {
  forward: { initial: { opacity: 0, x: 34 }, exit: { opacity: 0, x: -28 } },
  back: { initial: { opacity: 0, x: -34 }, exit: { opacity: 0, x: 28 } },
  in: { initial: { opacity: 0, scale: 1.06, y: 8 }, exit: { opacity: 0, scale: 0.965 } },
  out: { initial: { opacity: 0, scale: 0.94 }, exit: { opacity: 0, scale: 1.04 } },
};

export const SlideWrapper = ({ children, isActive, transition = "forward" }: SlideWrapperProps) => {
  const reduce = useReducedMotion();
  const variant = reduce
    ? { initial: { opacity: 0 }, exit: { opacity: 0 } }
    : VARIANTS[transition];

  return (
    <motion.div
      initial={variant.initial}
      animate={{ opacity: isActive ? 1 : 0, x: 0, y: 0, scale: 1 }}
      exit={variant.exit}
      transition={{ duration: reduce ? 0.2 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute inset-0 flex flex-col pt-12 sm:pt-14 md:pt-16 pb-16 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-10 ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {children}
    </motion.div>
  );
};
