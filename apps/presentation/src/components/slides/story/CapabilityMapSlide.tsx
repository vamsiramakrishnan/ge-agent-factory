import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layers3, Building2 } from "lucide-react";
import { AGENTS } from "../../../constants/agents";
import { VERTICALS } from "../../../verticals";
import { PeriodicTableSlide } from "./PeriodicTableSlide";
import { VerticalTableSlide } from "./VerticalTableSlide";

type Axis = "horizontal" | "vertical";

const HORIZONTAL_COUNT = AGENTS.length;
const VERTICAL_COUNT = VERTICALS.reduce((sum, v) => sum + v.agentCount, 0);

const AXES: Array<{
  key: Axis;
  label: string;
  sub: string;
  icon: typeof Layers3;
  count: number;
}> = [
  { key: "horizontal", label: "Horizontal", sub: "Departments", icon: Layers3, count: HORIZONTAL_COUNT },
  { key: "vertical", label: "Vertical", sub: "Industries", icon: Building2, count: VERTICAL_COUNT },
];

/**
 * The single "Map" hub. Both axes of the capability map live here behind one
 * toggle — Horizontal (the functions every enterprise shares) and Vertical
 * (the agents native to an industry). This is the deck's centerpiece: the
 * landing CTA and the header "Map" button both land here.
 */
export const CapabilityMapSlide = ({ defaultAxis = "horizontal" }: { defaultAxis?: Axis }) => {
  const [axis, setAxis] = useState<Axis>(defaultAxis);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      {/* Axis toggle — the primary control */}
      <div className="shrink-0 flex items-center justify-center mb-2">
        <div className="inline-flex items-center gap-0.5 p-1 rounded-lg bg-surface-container-low border border-outline-variant/30">
          {AXES.map((a) => {
            const Icon = a.icon;
            const isActive = axis === a.key;
            return (
              <button
                key={a.key}
                onClick={() => setAxis(a.key)}
                aria-pressed={isActive}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md transition-all duration-200 ${
                  isActive
                    ? "hero-gradient text-white shadow-ambient"
                    : "text-secondary/55 hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <div className="text-left leading-none">
                  <div className="text-[10px] sm:text-[11px] font-headline font-bold uppercase tracking-[0.08em]">
                    {a.label}
                  </div>
                  <div className={`text-[8px] mt-0.5 ${isActive ? "text-white/65" : "text-secondary/35"}`}>
                    {a.sub}
                  </div>
                </div>
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tabular-nums ${
                    isActive ? "bg-white/20 text-white" : "bg-surface-container text-secondary/50"
                  }`}
                >
                  {a.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active table */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={axis}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="h-full flex flex-col min-h-0"
          >
            {axis === "horizontal" ? <PeriodicTableSlide /> : <VerticalTableSlide />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
