import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { DOMAINS } from "../../../constants/domains";
import { useDepartment } from "../../../context/DepartmentContext";
import { DepartmentSwitcher } from "../../shared/DepartmentSwitcher";

const RACI_STYLES: Record<string, { bg: string; text: string }> = {
  "R": { bg: "bg-primary/15", text: "text-primary font-extrabold" },
  "C": { bg: "bg-amber-50", text: "text-amber-700 font-bold" },
  "I": { bg: "bg-slate-50", text: "text-slate-400" },
  "-": { bg: "", text: "text-transparent" },
};

export const RACISlide = () => {
  const { department, config } = useDepartment();
  const [minDomain, maxDomain] = config.domainRange;
  const domainSlice = DOMAINS.filter((_, idx) => {
    const num = idx + 1;
    return num >= minDomain && num <= maxDomain;
  });

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="mb-3 shrink-0 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-headline font-bold mb-1">Persona x Domain RACI</h2>
          <p className="text-sm text-secondary">Clear accountability mapping: <span className="text-primary font-bold">R</span> = Responsible, <span className="text-amber-600 font-bold">C</span> = Consulted, <span className="text-slate-400 font-bold">I</span> = Informed</p>
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
          className="flex-1 overflow-auto"
        >
          <table className="w-full border-collapse text-center">
            <thead>
              <tr>
                <th className="p-2 text-[9px] font-bold uppercase tracking-wider text-secondary/50 text-left sticky left-0 bg-background z-10">Persona</th>
                {domainSlice.map((d) => (
                  <th key={d.id} className="p-1.5">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: d.color }}>
                        <d.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[7px] font-bold text-secondary/50 uppercase leading-tight whitespace-nowrap">{d.title}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {config.raci.personas.map((persona, pi) => (
                <motion.tr
                  key={pi}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: pi * 0.03 }}
                  className="border-t border-outline-variant/10"
                >
                  <td className="p-2 text-[10px] font-headline font-bold text-left sticky left-0 bg-background z-10 whitespace-nowrap">{persona}</td>
                  {config.raci.matrix[pi].map((val, di) => {
                    const style = RACI_STYLES[val] || RACI_STYLES["-"];
                    return (
                      <td key={di} className="p-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto text-[11px] ${style.bg} ${style.text}`}>
                          {val}
                        </div>
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
