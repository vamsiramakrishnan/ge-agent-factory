import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Users, Cpu, BarChart3 } from "lucide-react";

export const ClosingCTASlide = () => (
  <div className="flex-1 flex flex-col justify-center items-center text-center relative">
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-primary/[0.04] blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/3 w-60 h-60 rounded-full bg-emerald-500/[0.03] blur-[80px]" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center mx-auto shadow-xl shadow-primary/20">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
    </motion.div>

    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-5xl font-headline font-extrabold mb-4 tracking-tight"
    >
      The Future of HR is{" "}
      <span className="text-primary">Agentic</span>
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-lg text-secondary max-w-xl leading-relaxed mb-10"
    >
      Not replacing humans — <span className="font-semibold text-on-surface">amplifying them</span>.
      Every agent is designed to give HR professionals superpowers.
    </motion.p>

    {/* Stats row */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-6 mb-10"
    >
      {[
        { icon: Cpu, stat: "82", label: "AI Agents" },
        { icon: Users, stat: "12", label: "Personas Served" },
        { icon: BarChart3, stat: "10", label: "HR Domains" },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/15">
          <item.icon className="w-5 h-5 text-primary" />
          <div className="text-left">
            <div className="text-2xl font-headline font-extrabold text-primary">{item.stat}</div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-secondary/50">{item.label}</div>
          </div>
        </div>
      ))}
    </motion.div>

    {/* CTA */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.45 }}
      className="flex items-center gap-3 px-6 py-3 rounded-xl hero-gradient text-white shadow-lg shadow-primary/20"
    >
      <span className="text-sm font-headline font-bold">Let&apos;s Start the Journey</span>
      <ArrowRight className="w-4 h-4" />
    </motion.div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.55 }}
      className="text-[10px] font-mono text-secondary/30 uppercase tracking-widest mt-8"
    >
      Google Cloud &middot; Gemini Enterprise &middot; 2026
    </motion.p>
  </div>
);
