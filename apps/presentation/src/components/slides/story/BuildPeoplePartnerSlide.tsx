import React from "react";
import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";

export const BuildPeoplePartnerSlide = () => (
  <div className="flex-1 flex flex-col">
    <h2 className="text-4xl font-headline font-bold mb-12">Build Blueprint: <span className="text-primary">People Partner</span></h2>
    <div className="grid grid-cols-2 gap-12 flex-1 items-center">
      <div className="glass-panel rounded-3xl p-8 aspect-square relative flex items-center justify-center overflow-hidden order-last md:order-first">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="relative w-full aspect-square flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20"
          >
            <TrendingUp className="w-16 h-16 text-primary" />
          </motion.div>
          <div className="absolute top-12 left-12 p-4 bg-white rounded-xl shadow-lg border border-outline-variant/20 text-[10px] font-bold">SENTIMENT PULSE</div>
          <div className="absolute bottom-12 right-12 p-4 bg-white rounded-xl shadow-lg border border-outline-variant/20 text-[10px] font-bold">CAREER PATHING</div>
          <div className="absolute top-1/2 -right-4 p-4 bg-white rounded-xl shadow-lg border border-outline-variant/20 text-[10px] font-bold">MEDIATION</div>
        </div>
      </div>
      <div className="space-y-8">
        {[
          { step: "01", title: "Sentiment Pulse Engine", desc: "Aggregates anonymized signals from communication platforms to detect early signs of burnout or disengagement." },
          { step: "02", title: "Skills Adjacency Modeling", desc: "Uses vector embeddings to map current employee skills to future internal roles, driving mobility." },
          { step: "03", title: "Policy-Grounded RAG", desc: "Provides managers with real-time mediation advice grounded in company policy and ER case precedents." }
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
    </div>
  </div>
);
