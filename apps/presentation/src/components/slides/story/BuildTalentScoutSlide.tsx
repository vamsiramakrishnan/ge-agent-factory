import React from "react";
import { motion } from "motion/react";
import { Layout, Brain, Zap } from "lucide-react";

export const BuildTalentScoutSlide = () => (
  <div className="flex-1 flex flex-col">
    <h2 className="text-4xl font-headline font-bold mb-12">Build Blueprint: <span className="text-primary">Talent Scout</span></h2>
    <div className="grid grid-cols-2 gap-12 flex-1 items-center">
      <div className="space-y-8">
        {[
          { step: "01", title: "Multi-modal Ingestion", desc: "Gemini parses resumes, portfolios, and GitHub profiles to extract deep technical signals beyond keywords." },
          { step: "02", title: "Skills Graph Mapping", desc: "Matches candidate experience against internal competency frameworks and role-specific success profiles." },
          { step: "03", title: "Autonomous Coordination", desc: "Orchestrates interview loops by reasoning over interviewer calendars and candidate availability." }
        ].map((item, i) => (
          <div key={i} className="flex gap-6">
            <span className="text-4xl font-headline font-black text-primary/20">{item.step}</span>
            <div>
              <h3 className="text-xl font-headline font-bold mb-2">{item.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-panel rounded-3xl p-8 aspect-square relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="grid grid-cols-2 gap-4 w-full max-w-md relative z-10">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-outline-variant/20 text-center">
            <Layout className="w-8 h-8 text-primary mx-auto mb-3" />
            <span className="text-xs font-bold uppercase">ATS (Greenhouse)</span>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-outline-variant/20 text-center">
            <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
            <span className="text-xs font-bold uppercase">Gemini 3.1 Pro</span>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-outline-variant/20 text-center col-span-2">
            <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
            <span className="text-xs font-bold uppercase">Vertex AI Search</span>
          </div>
        </div>
        <div className="absolute w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-0 w-full h-px bg-primary" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-primary" />
        </div>
      </div>
    </div>
  </div>
);
