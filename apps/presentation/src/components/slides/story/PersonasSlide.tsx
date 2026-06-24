import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDepartment } from "../../../context/DepartmentContext";
import { DepartmentSwitcher } from "../../shared/DepartmentSwitcher";

export const PersonasSlide = () => {
  const { department, config } = useDepartment();
  const personas = config.personas;
  const personaCount = personas.length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <div className="mb-3 shrink-0 flex items-start justify-between">
        <div>
          <AnimatePresence mode="wait">
            <motion.h2 key={department} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-headline font-bold mb-1">
              The {personaCount} {config.shortLabel} Personas
            </motion.h2>
          </AnimatePresence>
          <p className="text-sm text-secondary">Each persona maps to specific domains — agents are designed to augment their daily work.</p>
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 flex-1 auto-rows-min"
        >
          {personas.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: p.color }}>
                  <p.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-xs font-headline font-bold leading-tight group-hover:text-primary transition-colors">{p.title}</h3>
              </div>
              <p className="text-[10px] text-secondary leading-snug mb-2">{p.desc}</p>
              <div className="text-[8px] text-secondary/50 font-bold uppercase tracking-wider mb-1.5">Key Focus</div>
              <p className="text-[9px] text-secondary/70 leading-snug mb-2">{p.metrics}</p>
              <div className="flex gap-0.5">
                {p.domains.map(d => (
                  <div key={d} className="w-2 h-2 rounded-full" style={{ backgroundColor: config.domainColors[d] || "#999" }} title={`Domain ${d}`} />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
