import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export const TitleSlide = () => (
  <div className="flex-1 flex flex-col justify-center items-start max-w-4xl">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-primary/10 text-primary font-headline text-xs font-bold tracking-wider uppercase"
    >
      <Sparkles className="w-3.5 h-3.5" />
      Gemini Enterprise
    </motion.div>
    <motion.h1
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-6xl font-headline font-extrabold leading-[1.1] mb-6 tracking-tight"
    >
      HR & PeopleOps <br />
      <span className="text-primary">Agentic Transformation</span>
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-lg text-secondary max-w-2xl leading-relaxed mb-10"
    >
      Redefining the employee lifecycle through high-fidelity AI agents.
      From talent acquisition to organizational intelligence.
    </motion.p>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="flex items-center gap-6"
    >
      <div className="flex flex-col">
        <span className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-0.5">Strategy</span>
        <span className="font-headline font-bold text-sm">2026 Vision</span>
      </div>
      <div className="w-px h-8 bg-outline-variant/30" />
      <div className="flex flex-col">
        <span className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-0.5">Agents</span>
        <span className="font-headline font-bold text-sm text-primary">82 Use Cases</span>
      </div>
      <div className="w-px h-8 bg-outline-variant/30" />
      <div className="flex flex-col">
        <span className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-0.5">Status</span>
        <span className="font-headline font-bold text-sm text-tertiary">Confidential</span>
      </div>
    </motion.div>
  </div>
);
