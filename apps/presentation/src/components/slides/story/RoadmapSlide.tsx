import React from "react";
import { motion } from "motion/react";

export const RoadmapSlide = () => (
  <div className="flex-1 flex flex-col">
    <h2 className="text-4xl font-headline font-bold mb-12">Implementation Roadmap</h2>
    <div className="flex-1 flex items-center">
      <div className="w-full grid grid-cols-4 gap-4">
        {[
          { phase: "Q1", title: "Foundation", desc: "Data ingestion & agent training", clip: "asymmetric-clip-first" },
          { phase: "Q2", title: "Pilot", desc: "Talent Scout beta launch", clip: "asymmetric-clip" },
          { phase: "Q3", title: "Scale", desc: "Full PeopleOps integration", clip: "asymmetric-clip" },
          { phase: "Q4", title: "Optimize", desc: "Org-wide agentic intelligence", clip: "asymmetric-clip-last" }
        ].map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-10 h-64 flex flex-col justify-center bg-surface-container-low border border-outline-variant/30 ${step.clip}`}
          >
            <span className="text-xs font-mono font-bold text-primary mb-2">{step.phase}</span>
            <h3 className="text-xl font-headline font-bold mb-3">{step.title}</h3>
            <p className="text-sm text-secondary leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);
