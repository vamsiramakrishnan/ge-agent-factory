import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu } from "lucide-react";
import { useDepartment } from "../../../context/DepartmentContext";
import { DepartmentSwitcher } from "../../shared/DepartmentSwitcher";

export const DayInLifeSlide = () => {
  const { department, config } = useDepartment();
  const [selectedPersona, setSelectedPersona] = useState(0);
  const days = config.dayInLife;
  const day = days[selectedPersona];

  useEffect(() => {
    setSelectedPersona(0);
  }, [department]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <h2 className="text-3xl font-headline font-bold mb-1">A Day in the Life</h2>
          <p className="text-sm text-secondary">How agents transform the daily reality for {config.shortLabel} personas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {days.map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedPersona(i)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-headline font-bold uppercase tracking-wider transition-all ${
                  selectedPersona === i
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-secondary/60 hover:text-primary hover:bg-surface-container-low"
                }`}
              >
                {d.persona}
              </button>
            ))}
          </div>
          <div className="w-px h-6 bg-outline-variant/30" />
          <DepartmentSwitcher />
        </div>
      </div>

      <p className="text-xs text-secondary mb-3 shrink-0">{day.intro}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${department}-${selectedPersona}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="space-y-1.5 flex-1"
        >
          {day.blocks.map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex gap-3 group"
            >
              <div className="w-8 sm:w-12 shrink-0 text-right">
                <span className="text-[11px] font-mono font-bold text-secondary/40">{block.time}</span>
              </div>
              <div className="flex flex-col items-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors mt-1.5" />
                {i < day.blocks.length - 1 && <div className="w-px flex-1 bg-outline-variant/20" />}
              </div>
              <div className="flex-1 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/15 group-hover:border-primary/20 transition-colors">
                  <p className="text-[11px] text-on-surface leading-snug">{block.activity}</p>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {block.processes.map((p, j) => (
                      <span key={j} className="text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-container text-secondary/50">{p}</span>
                    ))}
                  </div>
                </div>
                {block.agentOpportunity && (
                  <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/15">
                    <div className="flex items-center gap-1 mb-1">
                      <Cpu className="w-2.5 h-2.5 text-primary" />
                      <span className="text-[7px] font-bold uppercase tracking-wider text-primary/60">Agent Augmentation</span>
                    </div>
                    <p className="text-[10px] text-primary/80 font-medium leading-snug">{block.agentOpportunity}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
