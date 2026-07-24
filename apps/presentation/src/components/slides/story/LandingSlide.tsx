import React from "react";
import { motion } from "motion/react";
import { Sparkles, Cpu, ArrowRight, Play, Grid3x3 } from "lucide-react";
import { DEPARTMENTS } from "../../../departments";
import { AGENTS } from "../../../constants/agents";
import { useSlideNavigation } from "../../../context/SlideContext";

export const LandingSlide = () => {
  const { nextSlide, goToSlide } = useSlideNavigation();
  const totalAgents = AGENTS.length;
  const totalDomains = DEPARTMENTS.reduce((sum, d) => sum + (d.domainRange[1] - d.domainRange[0] + 1), 0);
  const deptNames = DEPARTMENTS.map(d => d.shortLabel).join(" & ");

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/[0.04] blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-violet-500/[0.03] blur-[60px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/[0.02] blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
      >
        <div className="w-5 h-5 rounded-md hero-gradient flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
        <span className="text-xs font-headline font-bold text-primary uppercase tracking-wider">Gemini Enterprise — Agentic Transformation</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-extrabold leading-[1.05] mb-6 tracking-tight max-w-4xl"
      >
        Every Transformation{" "}
        <span className="relative">
          <span className="text-primary">Starts with People</span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -bottom-1 left-0 w-full h-1 hero-gradient rounded-full origin-left"
          />
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-base sm:text-lg text-secondary max-w-2xl leading-relaxed mb-12"
      >
        {totalAgents} AI agents. {totalDomains} domains. {deptNames}. One mission —{" "}
        <span className="font-semibold text-on-surface">amplify what makes enterprise functions human.</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 mb-12"
      >
        {DEPARTMENTS.map((dept, i) => {
          const Icon = dept.icon;
          const agentCount = AGENTS.filter(a => a.domain >= dept.domainRange[0] && a.domain <= dept.domainRange[1]).length;
          const domainCount = dept.domainRange[1] - dept.domainRange[0] + 1;
          return (
            <React.Fragment key={dept.key}>
              {i > 0 && <div className="w-px h-10 bg-outline-variant/30" />}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: dept.accentColor }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-headline font-bold">{dept.shortLabel}</div>
                  <div className="text-[10px] text-secondary">{agentCount} agents, {domainCount} domains</div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div className="w-px h-10 bg-outline-variant/30" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <div className="text-sm font-headline font-bold">Outcome Driven</div>
            <div className="text-[10px] text-secondary">Measurable transformation</div>
          </div>
        </div>
      </motion.div>

      {/* Actions — the map is the star; the story is the guided path */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row items-center gap-3 mb-12"
      >
        <button
          onClick={() => goToSlide("domain-map")}
          className="group flex items-center gap-3 px-8 py-3.5 rounded hero-gradient text-white font-headline font-bold text-sm uppercase tracking-[0.1em] shadow-ambient-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
        >
          <Grid3x3 className="w-4 h-4" />
          Explore the Capability Map
          <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </button>
        <button
          onClick={nextSlide}
          className="group flex items-center gap-2.5 px-6 py-3.5 rounded border border-outline-variant/50 text-on-surface font-headline font-bold text-sm uppercase tracking-[0.1em] hover:border-primary/50 hover:bg-surface-container transition-all duration-300 active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-current" />
          Begin Presentation
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-4 text-[10px] font-mono text-secondary/40 uppercase tracking-widest"
      >
        <span>Q2 2026 Strategy</span>
        <span className="text-outline-variant/30">|</span>
        <span>Confidential</span>
        <span className="text-outline-variant/30">|</span>
        <span>Google Cloud</span>
      </motion.div>
    </div>
  );
};
