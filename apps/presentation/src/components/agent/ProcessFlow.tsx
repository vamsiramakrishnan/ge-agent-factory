import React from "react";
import { motion } from "motion/react";
import { LucideIcon, Zap } from "lucide-react";

export interface FlowStep {
  label: string;
  icon: LucideIcon;
  description: string;
  systems?: string[];
  integration?: string;
  trigger?: string;
  output?: string;
}

interface ProcessFlowProps {
  steps: FlowStep[];
  color?: string;
}

export const ProcessFlow = ({ steps, color = "var(--color-primary)" }: ProcessFlowProps) => {
  return (
    <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-secondary">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-headline font-bold uppercase tracking-wider text-[11px]">Agent Workflow</span>
        </div>
      </div>

      <div className="relative flex items-start justify-between gap-2">
        {/* Connection Line */}
        <div className="absolute top-5 left-[5%] w-[90%] h-[2px] bg-outline-variant/20 -z-0" />

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="relative z-10 flex flex-col items-center text-center flex-1 group"
          >
            {/* Trigger Tag */}
            {step.trigger && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[8px] font-bold uppercase tracking-widest text-primary whitespace-nowrap">
                {step.trigger}
              </div>
            )}

            {/* Icon Circle */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-md transition-all group-hover:scale-110 bg-surface border-2 border-outline-variant group-hover:border-primary relative">
              <step.icon className="w-4 h-4 text-secondary group-hover:text-primary transition-colors" />
              {step.integration && (
                <div className="absolute -right-0.5 -bottom-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center border-2 border-surface">
                  <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                </div>
              )}
            </div>

            {/* Label */}
            <h4 className="font-headline font-bold text-[11px] mb-1 group-hover:text-primary transition-colors leading-tight">
              {step.label}
            </h4>

            {/* Systems */}
            {step.systems && (
              <div className="flex flex-wrap justify-center gap-0.5 mb-1.5">
                {step.systems.map((sys, i) => (
                  <span key={i} className="px-1 py-0.5 rounded bg-primary/5 border border-primary/10 text-[7px] font-bold uppercase text-primary/70">
                    {sys}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-[9px] text-secondary leading-snug mb-1.5">
              {step.description}
            </p>

            {/* Output Badge */}
            {step.output && (
              <div className="mt-auto px-1.5 py-0.5 rounded-md bg-surface border border-outline-variant/50 text-[8px] font-mono text-tertiary">
                {step.output}
              </div>
            )}

            {/* Animated connector */}
            {index < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.15 + 0.3, duration: 0.4 }}
                className="absolute top-5 left-[60%] w-[80%] h-[2px] bg-primary origin-left z-0"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
