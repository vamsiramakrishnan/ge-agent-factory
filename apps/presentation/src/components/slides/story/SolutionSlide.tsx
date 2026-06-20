import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export const SolutionSlide = () => (
  <div className="flex-1 flex flex-col">
    <div className="mb-6">
      <h2 className="text-3xl font-headline font-bold mb-2">The Agentic Blueprint</h2>
      <p className="text-sm text-secondary max-w-2xl">Moving from static automation to autonomous, reasoning agents that understand context and intent.</p>
    </div>
    <div className="grid grid-cols-3 gap-4 flex-1">
      {[
        {
          title: "Talent Scout",
          role: "Acquisition",
          features: ["Deep Resume Reasoning", "Cultural Fit Analysis", "Automated Scheduling"],
          color: "bg-blue-50"
        },
        {
          title: "People Partner",
          role: "Engagement",
          features: ["Sentiment Pulse", "Career Pathing", "Conflict Mediation Support"],
          color: "bg-indigo-50"
        },
        {
          title: "Ops Architect",
          role: "Infrastructure",
          features: ["Policy Synthesis", "Compliance Guardrails", "Org Design Simulation"],
          color: "bg-slate-50"
        }
      ].map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`p-6 rounded-2xl border border-outline-variant/20 flex flex-col ${card.color}`}
        >
          <span className="text-[9px] font-mono uppercase tracking-widest text-secondary mb-1">{card.role}</span>
          <h3 className="text-xl font-headline font-bold mb-4">{card.title}</h3>
          <ul className="space-y-3 flex-1">
            {card.features.map((f, j) => (
              <li key={j} className="flex items-center gap-2 text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-outline-variant/15 flex items-center justify-between">
            <span className="text-[9px] font-bold text-primary uppercase">Active Agent</span>
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
