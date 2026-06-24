import React from "react";
import { ShieldCheck, BarChart3, Globe } from "lucide-react";

export const BuildOpsArchitectSlide = () => (
  <div className="flex-1 flex flex-col">
    <h2 className="text-4xl font-headline font-bold mb-12">Build Blueprint: <span className="text-primary">Ops Architect</span></h2>
    <div className="grid grid-cols-2 gap-12 flex-1 items-center">
      <div className="space-y-8">
        {[
          { step: "01", title: "Unified Data Fabric", desc: "Connects HRIS, Payroll, and Benefits data into a single BigQuery instance for cross-system reasoning." },
          { step: "02", title: "Compliance Guardrails", desc: "Real-time auditing of data changes against global labor laws and internal policy constraints." },
          { step: "03", title: "Org Simulation Engine", desc: "Allows HR leaders to 'dry run' restructuring scenarios and see immediate impact on spans, layers, and costs." }
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
      <div className="grid grid-cols-2 gap-4">
        <div className="p-8 glass-panel rounded-2xl flex flex-col items-center justify-center text-center">
          <ShieldCheck className="w-10 h-10 text-primary mb-4" />
          <h4 className="font-headline font-bold text-sm">Compliance<br/>Engine</h4>
        </div>
        <div className="p-8 glass-panel rounded-2xl flex flex-col items-center justify-center text-center">
          <BarChart3 className="w-10 h-10 text-primary mb-4" />
          <h4 className="font-headline font-bold text-sm">Cost<br/>Modeling</h4>
        </div>
        <div className="p-8 glass-panel rounded-2xl flex flex-col items-center justify-center text-center col-span-2">
          <Globe className="w-10 h-10 text-primary mb-4" />
          <h4 className="font-headline font-bold text-sm">Global Policy RAG</h4>
          <p className="text-[10px] text-secondary mt-2">Grounding in 100+ Jurisdictions</p>
        </div>
      </div>
    </div>
  </div>
);
