import React from "react";
import { motion } from "motion/react";
import { Brain } from "lucide-react";

export const ClosingSlide = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-24 h-24 rounded-3xl hero-gradient flex items-center justify-center mb-12 shadow-2xl shadow-primary/20"
    >
      <Brain className="w-12 h-12 text-white" />
    </motion.div>
    <h2 className="text-6xl font-headline font-black mb-6 tracking-tight">The Future of Work <br />is <span className="text-primary">Agentic</span></h2>
    <p className="text-xl text-secondary max-w-xl mb-12">
      Join us in building the next generation of human-centric, AI-powered organizations.
    </p>
    <div className="flex gap-4">
      <button className="px-8 py-4 bg-primary text-white rounded-full font-headline font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
        Get Started
      </button>
      <button className="px-8 py-4 glass-panel rounded-full font-headline font-bold hover:bg-surface-container transition-all">
        View Whitepaper
      </button>
    </div>
  </div>
);
