import React from "react";
import { motion } from "motion/react";
import {
  Search,
  Wrench,
  Brain,
  Network,
  ArrowRight,
  Database,
} from "lucide-react";

interface EvolutionStage {
  stage: number;
  name: string;
  icon: React.ReactNode;
  description: string;
  capabilities: string[];
  examples: string[];
  layerBadge: string;
  layerDetail: string;
  colors: {
    border: string;
    bg: string;
    text: string;
    badgeBg: string;
    iconBg: string;
  };
}

const STAGES: EvolutionStage[] = [
  {
    stage: 1,
    name: "Grounded Agents",
    icon: <Search className="w-4 h-4" />,
    description:
      "Retrieval-Augmented Generation over HR knowledge bases. Policy Q&A, document search, FAQ answers.",
    capabilities: [
      "Knowledge retrieval",
      "Cited answers",
      "Context-aware responses",
    ],
    examples: ["Policy Assistant", "Benefits Q&A", "New Hire Q&A"],
    layerBadge: "Layer 1: OOTB",
    layerDetail: "Gemini in Google Workspace",
    colors: {
      border: "border-emerald-400",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      badgeBg: "bg-emerald-100 text-emerald-800",
      iconBg: "bg-emerald-100",
    },
  },
  {
    stage: 2,
    name: "Tool-Calling Agents",
    icon: <Wrench className="w-4 h-4" />,
    description:
      "Agents that call APIs, read/write to systems, and execute multi-step workflows autonomously.",
    capabilities: [
      "API orchestration",
      "System writes",
      "Multi-step reasoning",
    ],
    examples: [
      "Interview Scheduling",
      "Data Change Orchestrator",
      "Onboarding Orchestration",
    ],
    layerBadge: "Layer 2: Agent Designer",
    layerDetail: "No-code agent builder",
    colors: {
      border: "border-blue-400",
      bg: "bg-blue-50",
      text: "text-blue-700",
      badgeBg: "bg-blue-100 text-blue-800",
      iconBg: "bg-blue-100",
    },
  },
  {
    stage: 3,
    name: "Skill-Based Agents",
    icon: <Brain className="w-4 h-4" />,
    description:
      "Custom-built agents with specialized skills, domain expertise, and complex reasoning chains using ADK.",
    capabilities: [
      "Custom skills & ML models",
      "Domain reasoning",
      "Bias detection",
    ],
    examples: [
      "Resume Screening",
      "Pay Equity Audit",
      "Workforce Scenario Modeling",
    ],
    layerBadge: "Layer 3: Custom ADK",
    layerDetail: "Developer-built with Agent Development Kit",
    colors: {
      border: "border-violet-400",
      bg: "bg-violet-50",
      text: "text-violet-700",
      badgeBg: "bg-violet-100 text-violet-800",
      iconBg: "bg-violet-100",
    },
  },
  {
    stage: 4,
    name: "Agent Harnesses",
    icon: <Network className="w-4 h-4" />,
    description:
      "Orchestrated multi-agent systems where specialized agents collaborate, delegate, and reason across domains.",
    capabilities: [
      "Agent-to-agent (A2A)",
      "Cross-domain orchestration",
      "Human-in-the-loop gates",
    ],
    examples: [
      "End-to-end hiring pipeline",
      "Performance review cycle",
      "Offboarding orchestration",
    ],
    layerBadge: "Layer 4: Data Agents + Harness",
    layerDetail: "Analytics + orchestration",
    colors: {
      border: "border-amber-400",
      bg: "bg-amber-50",
      text: "text-amber-700",
      badgeBg: "bg-amber-100 text-amber-800",
      iconBg: "bg-amber-100",
    },
  },
];

export const AgentEvolutionSlide = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-3 shrink-0">
        <h2 className="text-3xl font-headline font-bold mb-1">
          Evolution of Agents
        </h2>
        <p className="text-sm text-secondary">
          From retrieval to multi-agent orchestration — a maturity progression
          for platform architects
        </p>
      </div>

      {/* Evolution Timeline */}
      <div className="grid grid-cols-4 gap-3 flex-1 min-h-0">
        {STAGES.map((stage, i) => (
          <div key={stage.stage} className="flex items-stretch gap-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
              className={`flex-1 rounded-xl border-t-[3px] ${stage.colors.border} border border-outline-variant/20 bg-surface-container-lowest flex flex-col overflow-hidden`}
            >
              {/* Stage header */}
              <div className={`px-3 py-2.5 ${stage.colors.bg}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-6 h-6 rounded-md ${stage.colors.iconBg} ${stage.colors.text} flex items-center justify-center`}
                  >
                    {stage.icon}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-secondary">
                      Stage {stage.stage}
                    </span>
                    <h3
                      className={`text-xs font-headline font-bold ${stage.colors.text} leading-tight`}
                    >
                      {stage.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="px-3 py-2 border-b border-outline-variant/10">
                <p className="text-[10px] text-secondary leading-snug">
                  {stage.description}
                </p>
              </div>

              {/* Capabilities */}
              <div className="px-3 py-2 border-b border-outline-variant/10">
                <span className="text-[8px] font-mono uppercase tracking-widest text-secondary font-bold">
                  Capabilities
                </span>
                <ul className="mt-1 space-y-0.5">
                  {stage.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="text-[10px] text-slate-700 flex items-start gap-1"
                    >
                      <span className={`mt-1 w-1 h-1 rounded-full ${stage.colors.border.replace("border-", "bg-")} shrink-0`} />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Example Agents */}
              <div className="px-3 py-2 border-b border-outline-variant/10 flex-1">
                <span className="text-[8px] font-mono uppercase tracking-widest text-secondary font-bold">
                  Example Agents
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {stage.examples.map((ex) => (
                    <span
                      key={ex}
                      className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              {/* Layer Badge */}
              <div className={`px-3 py-2 ${stage.colors.bg}`}>
                <span
                  className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${stage.colors.badgeBg}`}
                >
                  {stage.layerBadge}
                </span>
                <p className="text-[9px] text-secondary mt-0.5">
                  {stage.layerDetail}
                </p>
              </div>
            </motion.div>

            {/* Arrow connector between stages */}
            {i < STAGES.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center justify-center w-5 shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Data Agents Foundation Strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-3 shrink-0"
      >
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-2.5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-amber-100 flex items-center justify-center">
            <Database className="w-4 h-4 text-amber-700" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-headline font-bold text-amber-800">
                Data Agents
              </span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-amber-600">
                Foundation Layer — Spans All Stages
              </span>
            </div>
            <p className="text-[10px] text-amber-700/80 leading-snug">
              BigQuery, Looker, ML pipelines — the analytics foundation powering
              all agent tiers
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
