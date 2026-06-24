import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plug, Shield, Code, Wrench, ArrowDown, Bot, Repeat } from "lucide-react";
import { useDepartment } from "../../../context/DepartmentContext";
import { DepartmentSwitcher } from "../../shared/DepartmentSwitcher";
import { AGENTS } from "../../../constants/agents";

const INTEGRATIONS = [
  { title: "Cloud Application Integration", subtitle: "iPaaS for event-driven, no-code integrations", icon: Plug, colors: { border: "border-sky-300", bg: "bg-sky-50", text: "text-sky-700", iconBg: "bg-sky-100" } },
  { title: "Apigee API Management", subtitle: "API gateway for secure, governed access", icon: Shield, colors: { border: "border-teal-300", bg: "bg-teal-50", text: "text-teal-700", iconBg: "bg-teal-100" } },
  { title: "BYO-MCP", subtitle: "Open standard for agent-to-system comms", icon: Code, colors: { border: "border-indigo-300", bg: "bg-indigo-50", text: "text-indigo-700", iconBg: "bg-indigo-100" } },
  { title: "Custom Connector Framework", subtitle: "ADK-based integrations for complex workflows", icon: Wrench, colors: { border: "border-amber-300", bg: "bg-amber-50", text: "text-amber-700", iconBg: "bg-amber-100" } },
];

const TIER_BADGES = [
  { label: "OOTB", color: "bg-teal-100 text-teal-800" },
  { label: "Agent Designer", color: "bg-sky-100 text-sky-800" },
  { label: "Custom ADK", color: "bg-indigo-100 text-indigo-800" },
  { label: "Data Agent", color: "bg-amber-100 text-amber-800" },
];

const A2A_BULLETS = ["Cross-cloud agent discovery", "Capability negotiation", "Secure delegation", "Multi-vendor orchestration"];

export const IntegrationArchitectureSlide = () => {
  const { department, config } = useDepartment();
  const [minDomain, maxDomain] = config.domainRange;
  const agentCount = AGENTS.filter(a => a.domain >= minDomain && a.domain <= maxDomain).length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <div className="mb-3 shrink-0 flex items-start justify-between">
        <div>
          <AnimatePresence mode="wait">
            <motion.h2 key={department} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-headline font-bold mb-1">Integration Architecture</motion.h2>
          </AnimatePresence>
          <p className="text-sm text-secondary">How Gemini Enterprise agents connect to {config.shortLabel} systems of record</p>
        </div>
        <DepartmentSwitcher />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={department} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col gap-1 flex-1">
          {/* Layer 1: Systems of Record */}
          <div className="shrink-0">
            <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-1.5 px-1">{config.shortLabel} Systems of Record</div>
            <div className="flex flex-wrap gap-1.5">
              {config.integrationSystems.map((sys, i) => (
                <motion.div key={sys} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600">{sys}</motion.div>
              ))}
            </div>
          </div>

          <div className="flex justify-center py-0.5 shrink-0"><ArrowDown className="w-3.5 h-3.5 text-slate-300" /></div>

          {/* Layer 2: Integration Layer */}
          <div className="shrink-0">
            <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-1.5 px-1">Integration Layer</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {INTEGRATIONS.map((intg, i) => {
                const Icon = intg.icon;
                return (
                  <motion.div key={intg.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                    className={`rounded-lg border ${intg.colors.border} ${intg.colors.bg} px-3 py-2`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`w-5 h-5 rounded ${intg.colors.iconBg} ${intg.colors.text} flex items-center justify-center`}><Icon className="w-3.5 h-3.5" /></div>
                      <span className={`text-[10px] font-headline font-bold ${intg.colors.text} leading-tight`}>{intg.title}</span>
                    </div>
                    <p className="text-[9px] text-slate-600 leading-snug">{intg.subtitle}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center py-0.5 shrink-0"><ArrowDown className="w-3.5 h-3.5 text-slate-300" /></div>

          {/* Layer 3: Gemini Agent Platform */}
          <div className="shrink-0">
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-xs font-headline font-bold text-primary">Gemini Agent Platform</span>
                <span className="text-[10px] text-primary/70 ml-1">{agentCount} agents across 4 implementation tiers</span>
              </div>
              <div className="flex gap-2">
                {TIER_BADGES.map(badge => (
                  <span key={badge.label} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center py-0.5 shrink-0"><ArrowDown className="w-3.5 h-3.5 text-slate-300" /></div>

          {/* Layer 4: A2A Protocol */}
          <div className="shrink-0">
            <div className="rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-rose-100 flex items-center justify-center"><Repeat className="w-3.5 h-3.5 text-rose-600" /></div>
                <span className="text-xs font-headline font-bold text-rose-700">A2A — Agent-to-Agent Protocol</span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-rose-500 ml-2">Cross-Cloud Agentic</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 rounded-lg bg-primary/[0.08] border border-primary/15 px-3 py-1.5 text-center">
                  <span className="text-[10px] font-bold text-primary">Gemini Agents</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <div className="w-6 h-px bg-rose-300" />
                  <span className="text-[8px] font-mono font-bold text-rose-500 bg-rose-100 px-1.5 py-0.5 rounded">A2A</span>
                  <div className="w-6 h-px bg-rose-300" />
                </div>
                <div className="flex-1 rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5">
                  <span className="text-[10px] font-bold text-slate-600">External Agents</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {config.externalAgents.map(agent => (
                      <span key={agent} className="text-[8px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">{agent}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                {A2A_BULLETS.map(bullet => (
                  <span key={bullet} className="text-[9px] text-rose-600 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-rose-400 shrink-0" />{bullet}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
