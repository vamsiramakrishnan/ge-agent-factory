import React from "react";
import { motion } from "motion/react";
import { ImpactChart } from "../../shared/ImpactChart";

const impactData = [
  { label: "Administrative Load", before: 75, after: 12 },
  { label: "Strategic Focus", before: 25, after: 88 },
  { label: "Employee Satisfaction", before: 42, after: 94 },
  { label: "Recruitment Speed", before: 35, after: 92 },
  { label: "Retention Lift", before: 20, after: 65 },
  { label: "Compliance Accuracy", before: 60, after: 99 }
];

export const ImpactSlide = () => (
  <div className="flex-1 flex flex-col justify-center">
    <div className="grid grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-5xl font-headline font-bold mb-8 leading-tight">Quantifiable <br />Transformation</h2>
        <p className="text-lg text-secondary mb-12">
          We're not just improving metrics; we're fundamentally shifting the ROI of People Operations.
        </p>
        <div className="grid grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-4xl font-headline font-bold text-primary mb-1">85%</div>
            <p className="text-xs font-mono uppercase tracking-widest text-secondary">Operational Efficiency</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-4xl font-headline font-bold text-primary mb-1">3.2x</div>
            <p className="text-xs font-mono uppercase tracking-widest text-secondary">Strategic Impact</p>
          </motion.div>
        </div>
      </div>
      <div className="p-8 glass-panel rounded-3xl border border-outline-variant/30 shadow-2xl shadow-primary/5">
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-secondary">Agentic ROI Benchmark</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-tertiary/30" />
              <span className="text-[10px] font-bold uppercase text-secondary">Status Quo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase text-primary">Agentic</span>
            </div>
          </div>
        </div>
        <ImpactChart data={impactData} />
      </div>
    </div>
  </div>
);
