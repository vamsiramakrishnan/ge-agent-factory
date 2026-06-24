import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDepartment } from "../../../context/DepartmentContext";
import { DepartmentSwitcher } from "../../shared/DepartmentSwitcher";

export const ChallengeSlide = () => {
  const { department, config } = useDepartment();
  const data = config.challenge;

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-end mb-4 shrink-0">
        <DepartmentSwitcher />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={department}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl font-headline font-bold mb-6">{data.title}</h2>
            <div className="space-y-4">
              {data.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30"
                >
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm mb-0.5">{item.title}</h3>
                    <p className="text-xs text-secondary">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative aspect-square glass-panel rounded-2xl overflow-hidden flex items-center justify-center p-8">
            <div className="absolute inset-0 hero-gradient opacity-5" />
            <div className="text-center">
              <div className="text-7xl font-headline font-black text-primary mb-2">{data.stat}</div>
              <p className="text-base font-headline font-bold text-on-surface uppercase tracking-widest">{data.statLabel}</p>
              <p className="text-xs text-secondary mt-3 max-w-xs mx-auto">{data.statDesc}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
