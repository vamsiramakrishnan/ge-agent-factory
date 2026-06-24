import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Layers, Bot, Database, LayoutDashboard, Zap, AlertTriangle, Sparkles } from "lucide-react";
import { useDepartment } from "../../../context/DepartmentContext";
import { DepartmentSwitcher } from "../../shared/DepartmentSwitcher";

const TO_BE_ICONS = [Layers, Bot, Database, LayoutDashboard];

export const HRTechLandscapeSlide = () => {
  const { department, config } = useDepartment();
  const { techLandscape } = config;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <div className="mb-4 shrink-0 flex items-start justify-between">
        <div>
          <AnimatePresence mode="wait">
            <motion.h2 key={department} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-headline font-bold mb-1">
              {config.shortLabel} Technology Landscape
            </motion.h2>
          </AnimatePresence>
          <p className="text-sm text-secondary">From fragmented tools to an agentic platform</p>
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
          className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1"
        >
          {/* As-Is Column */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-tertiary/5 border-b border-tertiary/15">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-tertiary" />
                <h3 className="text-base font-headline font-bold text-tertiary">As-Is Stack</h3>
              </div>
              <p className="text-[10px] text-tertiary/70 mt-0.5 font-mono uppercase tracking-wider">Fragmented & Manual</p>
            </div>
            <div className="p-3 flex-1 flex flex-col gap-1.5">
              {techLandscape.asIs.map((sys, i) => (
                <motion.div
                  key={sys.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-tertiary/[0.03] hover:bg-tertiary/[0.06] transition-colors"
                >
                  <div className="w-6 h-6 rounded-md bg-tertiary/10 flex items-center justify-center">
                    <Database className="w-3 h-3 text-tertiary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-on-surface">{sys.label}</span>
                    <span className="text-[10px] text-secondary ml-1.5">{sys.tools}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="px-4 py-2.5 bg-tertiary/5 border-t border-tertiary/10">
              <p className="text-[10px] text-tertiary/80 font-medium italic">{techLandscape.painPoint}</p>
            </div>
          </div>

          {/* To-Be Column */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-primary/5 border-b border-primary/15">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-base font-headline font-bold text-primary">To-Be Stack</h3>
              </div>
              <p className="text-[10px] text-primary/70 mt-0.5 font-mono uppercase tracking-wider">Unified & Agentic</p>
            </div>
            <div className="p-3 flex-1 flex flex-col gap-2">
              {techLandscape.toBe.map((layer, i) => {
                const Icon = TO_BE_ICONS[i] || Layers;
                return (
                  <motion.div
                    key={layer.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex-1 relative"
                  >
                    <div className="h-full rounded-lg border border-primary/15 bg-primary/[0.03] px-4 py-2.5 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-xs font-headline font-bold text-primary">{layer.label}</span>
                      </div>
                      <p className="text-[10px] text-secondary leading-snug">{layer.description}</p>
                    </div>
                    {i < techLandscape.toBe.length - 1 && (
                      <div className="flex justify-center -mb-1 relative z-10">
                        <div className="w-px h-2 bg-primary/20" />
                        <ArrowRight className="w-3 h-3 text-primary/30 rotate-90 absolute -bottom-1" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="px-4 py-2.5 bg-primary/5 border-t border-primary/10">
              <p className="text-[10px] text-primary/80 font-medium italic">{techLandscape.benefit}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-3 mt-3 shrink-0"
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-tertiary/20 to-tertiary/30" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/15">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Agentic Transformation</span>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/20 to-primary/30" />
      </motion.div>
    </div>
  );
};
