import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Cpu } from "lucide-react";
import { useDepartment } from "../../../context/DepartmentContext";
import { DepartmentSwitcher } from "../../shared/DepartmentSwitcher";

export const TransformationBlueprintSlide = () => {
  const { department, config } = useDepartment();
  const steps = config.transformationSteps;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <div className="mb-4 shrink-0 flex items-start justify-between">
        <div>
          <AnimatePresence mode="wait">
            <motion.h2 key={department} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-headline font-bold mb-1">
              {config.shortLabel} Transformation Blueprint
            </motion.h2>
          </AnimatePresence>
          <p className="text-sm text-secondary">As-Is to To-Be — step by step, process by process, with measurable impact</p>
        </div>
        <DepartmentSwitcher />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={department}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex-1 space-y-3"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden"
            >
              {/* Domain header */}
              <div className="px-4 py-2 bg-surface-container-low border-b border-outline-variant/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: config.accentColor }}>
                    <Cpu className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-headline font-bold">{step.domain}</span>
                  <span className="text-[9px] text-secondary/50 font-mono">— {step.activity}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary">{step.agentName}</span>
                </div>
              </div>

              {/* As-Is → To-Be */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-0 items-stretch">
                {/* As-Is */}
                <div className="p-3 border-r border-outline-variant/10">
                  <div className="text-[7px] font-bold uppercase tracking-widest text-tertiary/60 mb-1">As-Is</div>
                  <p className="text-[10px] text-secondary leading-snug">{step.asIs}</p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center px-2">
                  <ArrowRight className="w-4 h-4 text-primary/40" />
                </div>

                {/* To-Be */}
                <div className="p-3 bg-primary/[0.03] border-l border-outline-variant/10">
                  <div className="text-[7px] font-bold uppercase tracking-widest text-primary/60 mb-1">To-Be</div>
                  <p className="text-[10px] text-on-surface font-medium leading-snug">{step.toBe}</p>
                </div>

                {/* Impact */}
                <div className="flex items-center px-3 bg-primary/5 border-l border-primary/10">
                  <div className="text-center">
                    <div className="text-[7px] font-bold uppercase tracking-widest text-primary/50 mb-0.5">Impact</div>
                    <div className="text-[9px] font-bold text-primary leading-snug">{step.impact}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
