# Periodic Table + Deep Dive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the domain map with a periodic-table view of all 82 agents, and redesign use case slides with tabbed deep-dive layout featuring swimlane workflows, trigger types, and HITL checkpoints.

**Architecture:** Three new components (PeriodicTableSlide, SwimlaneFlow, tabbed UseCaseSlide) plus a data layer (agents.ts) defining all 82 agent metadata. The periodic table is the navigation hub; clicking an element navigates to that agent's deep-dive slide. The deep dive has two tabs: Overview (existing before/after + KPIs) and Agent Workflow (swimlane with HITL gates).

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Framer Motion (motion/react), lucide-react icons

---

### Task 1: Create agents.ts constants file

**Files:**
- Create: `src/constants/agents.ts`

This file defines the metadata for all 82 agents used by the periodic table and deep-dive badges.

- [ ] **Step 1: Create the types and data file**

```ts
// src/constants/agents.ts
export type TriggerType = "event" | "chat" | "scheduled";

export interface AgentElement {
  id: string;
  agentId: string;
  shortName: string;
  domain: number;
  layer: 1 | 2 | 3 | 4;
  triggerType: TriggerType;
  hitl?: boolean;
  hitlActor?: string;
  hitlAction?: string;
}

export const TRIGGER_CONFIG = {
  event: { icon: "Zap", label: "Event-Driven", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  chat: { icon: "MessageCircle", label: "Chat-Initiated", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  scheduled: { icon: "Clock", label: "Scheduled", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
} as const;

export const AGENTS: AgentElement[] = [
  // Domain 1 - Workforce Planning
  { id: "uc-101", agentId: "A-101", shortName: "Scenario Modeling", domain: 1, layer: 3, triggerType: "scheduled", hitl: false },
  { id: "uc-102", agentId: "A-102", shortName: "Market Intel", domain: 1, layer: 4, triggerType: "scheduled" },
  { id: "uc-103", agentId: "A-103", shortName: "Plan Drafter", domain: 1, layer: 1, triggerType: "chat" },
  { id: "uc-104", agentId: "A-104", shortName: "Org Analyzer", domain: 1, layer: 4, triggerType: "scheduled" },
  { id: "uc-105", agentId: "A-105", shortName: "Change Comms", domain: 1, layer: 1, triggerType: "event" },
  { id: "uc-106", agentId: "A-106", shortName: "Restructure Impact", domain: 1, layer: 3, triggerType: "event", hitl: true, hitlActor: "CHRO", hitlAction: "Approve impact plan" },
  { id: "uc-107", agentId: "A-107", shortName: "JD Optimizer", domain: 1, layer: 1, triggerType: "chat" },
  { id: "uc-108", agentId: "A-108", shortName: "Arch Sync", domain: 1, layer: 2, triggerType: "event" },

  // Domain 2 - Talent Acquisition
  { id: "uc-201", agentId: "A-201", shortName: "Req Intake", domain: 2, layer: 2, triggerType: "chat", hitl: true, hitlActor: "HRBP", hitlAction: "Validate requisition" },
  { id: "uc-202", agentId: "A-202", shortName: "Req Priority", domain: 2, layer: 4, triggerType: "scheduled" },
  { id: "uc-203", agentId: "A-203", shortName: "Sourcing", domain: 2, layer: 2, triggerType: "event" },
  { id: "uc-204", agentId: "A-204", shortName: "Resume Screen", domain: 2, layer: 3, triggerType: "event", hitl: true, hitlActor: "Recruiter", hitlAction: "Review shortlist" },
  { id: "uc-205", agentId: "A-205", shortName: "Channel Analytics", domain: 2, layer: 4, triggerType: "scheduled" },
  { id: "uc-206", agentId: "A-206", shortName: "Scorecard", domain: 2, layer: 1, triggerType: "chat" },
  { id: "uc-207", agentId: "A-207", shortName: "Interview Sched", domain: 2, layer: 2, triggerType: "event" },
  { id: "uc-208", agentId: "A-208", shortName: "Debrief", domain: 2, layer: 1, triggerType: "event" },
  { id: "uc-209", agentId: "A-209", shortName: "Offer Modeler", domain: 2, layer: 3, triggerType: "event", hitl: true, hitlActor: "Comp Manager", hitlAction: "Approve offer" },
  { id: "uc-210", agentId: "A-210", shortName: "Pre-boarding", domain: 2, layer: 2, triggerType: "event" },
  { id: "uc-211", agentId: "A-211", shortName: "Onboarding", domain: 2, layer: 2, triggerType: "event" },
  { id: "uc-212", agentId: "A-212", shortName: "New Hire Q&A", domain: 2, layer: 1, triggerType: "chat" },
  { id: "uc-213", agentId: "A-213", shortName: "Onboard Analytics", domain: 2, layer: 4, triggerType: "scheduled" },

  // Domain 3 - Performance & Talent Management
  { id: "uc-301", agentId: "A-301", shortName: "Goal Drafting", domain: 3, layer: 1, triggerType: "chat" },
  { id: "uc-302", agentId: "A-302", shortName: "OKR Tracker", domain: 3, layer: 2, triggerType: "scheduled" },
  { id: "uc-303", agentId: "A-303", shortName: "1:1 Prep", domain: 3, layer: 2, triggerType: "scheduled" },
  { id: "uc-304", agentId: "A-304", shortName: "Feedback Trends", domain: 3, layer: 4, triggerType: "scheduled" },
  { id: "uc-305", agentId: "A-305", shortName: "Perf Narrative", domain: 3, layer: 1, triggerType: "event", hitl: true, hitlActor: "Manager", hitlAction: "Review & edit narrative" },
  { id: "uc-306", agentId: "A-306", shortName: "Calibration", domain: 3, layer: 4, triggerType: "event" },
  { id: "uc-307", agentId: "A-307", shortName: "Review Orch", domain: 3, layer: 2, triggerType: "scheduled" },
  { id: "uc-308", agentId: "A-308", shortName: "Successor", domain: 3, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CHRO", hitlAction: "Validate succession map" },
  { id: "uc-309", agentId: "A-309", shortName: "Succession Pipe", domain: 3, layer: 4, triggerType: "scheduled" },
  { id: "uc-310", agentId: "A-310", shortName: "HiPo ID", domain: 3, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CHRO", hitlAction: "Approve HiPo nominations" },
  { id: "uc-311", agentId: "A-311", shortName: "HiPo Journey", domain: 3, layer: 2, triggerType: "event" },

  // Domain 4 - Total Rewards
  { id: "uc-401", agentId: "A-401", shortName: "Benchmarking", domain: 4, layer: 4, triggerType: "scheduled" },
  { id: "uc-402", agentId: "A-402", shortName: "Comp Philosophy", domain: 4, layer: 1, triggerType: "chat" },
  { id: "uc-403", agentId: "A-403", shortName: "Merit Modeler", domain: 4, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Comp Manager", hitlAction: "Approve merit budgets" },
  { id: "uc-404", agentId: "A-404", shortName: "Pay Equity", domain: 4, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CHRO", hitlAction: "Approve remediation plan" },
  { id: "uc-405", agentId: "A-405", shortName: "Comp Letters", domain: 4, layer: 1, triggerType: "event" },
  { id: "uc-406", agentId: "A-406", shortName: "Benefits Q&A", domain: 4, layer: 1, triggerType: "chat" },
  { id: "uc-407", agentId: "A-407", shortName: "Benefits Analytics", domain: 4, layer: 4, triggerType: "scheduled" },
  { id: "uc-408", agentId: "A-408", shortName: "Rewards Opt", domain: 4, layer: 3, triggerType: "event", hitl: true, hitlActor: "Comp Manager", hitlAction: "Approve rewards package" },
  { id: "uc-409", agentId: "A-409", shortName: "Equity Comms", domain: 4, layer: 1, triggerType: "event" },

  // Domain 5 - Learning & Development
  { id: "uc-501", agentId: "A-501", shortName: "Skills Gap", domain: 5, layer: 3, triggerType: "scheduled" },
  { id: "uc-502", agentId: "A-502", shortName: "L&D Drafter", domain: 5, layer: 1, triggerType: "chat" },
  { id: "uc-503", agentId: "A-503", shortName: "Content Summ", domain: 5, layer: 1, triggerType: "chat" },
  { id: "uc-504", agentId: "A-504", shortName: "Learning Paths", domain: 5, layer: 2, triggerType: "chat" },
  { id: "uc-505", agentId: "A-505", shortName: "Compliance Gen", domain: 5, layer: 1, triggerType: "event" },
  { id: "uc-506", agentId: "A-506", shortName: "Compliance Track", domain: 5, layer: 2, triggerType: "scheduled" },
  { id: "uc-507", agentId: "A-507", shortName: "Leadership", domain: 5, layer: 1, triggerType: "chat" },
  { id: "uc-508", agentId: "A-508", shortName: "Program Impact", domain: 5, layer: 4, triggerType: "scheduled" },

  // Domain 6 - Employee Relations & Compliance
  { id: "uc-601", agentId: "A-601", shortName: "ER Case Intel", domain: 6, layer: 3, triggerType: "event", hitl: true, hitlActor: "ER Lead", hitlAction: "Review investigation findings" },
  { id: "uc-602", agentId: "A-602", shortName: "Case Analytics", domain: 6, layer: 4, triggerType: "scheduled" },
  { id: "uc-603", agentId: "A-603", shortName: "PIP Docs", domain: 6, layer: 1, triggerType: "event", hitl: true, hitlActor: "Manager", hitlAction: "Review PIP document" },
  { id: "uc-604", agentId: "A-604", shortName: "Discipline", domain: 6, layer: 2, triggerType: "event", hitl: true, hitlActor: "HRBP", hitlAction: "Approve discipline action" },
  { id: "uc-605", agentId: "A-605", shortName: "Policy Q&A", domain: 6, layer: 1, triggerType: "chat" },
  { id: "uc-606", agentId: "A-606", shortName: "Policy Draft", domain: 6, layer: 1, triggerType: "chat" },
  { id: "uc-607", agentId: "A-607", shortName: "Leave Intake", domain: 6, layer: 2, triggerType: "chat" },
  { id: "uc-608", agentId: "A-608", shortName: "Leave Analytics", domain: 6, layer: 4, triggerType: "scheduled" },

  // Domain 7 - Employee Engagement & Culture
  { id: "uc-701", agentId: "A-701", shortName: "Survey Design", domain: 7, layer: 2, triggerType: "scheduled" },
  { id: "uc-702", agentId: "A-702", shortName: "Engagement", domain: 7, layer: 3, triggerType: "event" },
  { id: "uc-703", agentId: "A-703", shortName: "Outcome Corr", domain: 7, layer: 4, triggerType: "scheduled" },
  { id: "uc-704", agentId: "A-704", shortName: "Recog Analytics", domain: 7, layer: 4, triggerType: "scheduled" },
  { id: "uc-705", agentId: "A-705", shortName: "Recog Nudge", domain: 7, layer: 2, triggerType: "event" },
  { id: "uc-706", agentId: "A-706", shortName: "Comms Drafter", domain: 7, layer: 1, triggerType: "chat" },
  { id: "uc-707", agentId: "A-707", shortName: "Comms Sentiment", domain: 7, layer: 4, triggerType: "scheduled" },

  // Domain 8 - HR Operations & Shared Services
  { id: "uc-801", agentId: "A-801", shortName: "Data Quality", domain: 8, layer: 2, triggerType: "scheduled" },
  { id: "uc-802", agentId: "A-802", shortName: "Data Orch", domain: 8, layer: 2, triggerType: "event" },
  { id: "uc-803", agentId: "A-803", shortName: "Query Resolve", domain: 8, layer: 2, triggerType: "chat" },
  { id: "uc-804", agentId: "A-804", shortName: "Service Analytics", domain: 8, layer: 4, triggerType: "scheduled" },
  { id: "uc-805", agentId: "A-805", shortName: "Payroll Valid", domain: 8, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Payroll Manager", hitlAction: "Approve payroll run" },
  { id: "uc-806", agentId: "A-806", shortName: "Payroll Recon", domain: 8, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Payroll Manager", hitlAction: "Sign off reconciliation" },
  { id: "uc-807", agentId: "A-807", shortName: "Offboarding", domain: 8, layer: 2, triggerType: "event" },
  { id: "uc-808", agentId: "A-808", shortName: "Exit Insights", domain: 8, layer: 1, triggerType: "scheduled" },
  { id: "uc-809", agentId: "A-809", shortName: "Attrition Analytics", domain: 8, layer: 4, triggerType: "scheduled" },

  // Domain 9 - DEI & Belonging
  { id: "uc-901", agentId: "A-901", shortName: "DEI Dashboard", domain: 9, layer: 4, triggerType: "scheduled" },
  { id: "uc-902", agentId: "A-902", shortName: "Inclusive Hiring", domain: 9, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "TA Lead", hitlAction: "Review hiring equity data" },
  { id: "uc-903", agentId: "A-903", shortName: "DEI Programs", domain: 9, layer: 1, triggerType: "chat" },
  { id: "uc-904", agentId: "A-904", shortName: "ERG Impact", domain: 9, layer: 4, triggerType: "scheduled" },

  // Domain 10 - People Analytics & HR Technology
  { id: "uc-1001", agentId: "A-1001", shortName: "Data Lake", domain: 10, layer: 4, triggerType: "chat" },
  { id: "uc-1002", agentId: "A-1002", shortName: "Attrition Pred", domain: 10, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "HRBP", hitlAction: "Review risk scores & intervene" },
  { id: "uc-1003", agentId: "A-1003", shortName: "Cost Modeling", domain: 10, layer: 3, triggerType: "chat" },
  { id: "uc-1004", agentId: "A-1004", shortName: "Tech Intel", domain: 10, layer: 2, triggerType: "scheduled" },
  { id: "uc-1005", agentId: "A-1005", shortName: "Vendor Eval", domain: 10, layer: 1, triggerType: "chat" },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/constants/agents.ts
git commit -m "Add agents.ts with 82 agent element definitions, trigger types, and HITL metadata"
```

---

### Task 2: Build PeriodicTableSlide component

**Files:**
- Create: `src/components/slides/PeriodicTableSlide.tsx`

This component renders all 82 agents as a periodic-table grid. Each element is clickable and navigates to the agent's deep-dive slide.

- [ ] **Step 1: Create the component**

```tsx
// src/components/slides/PeriodicTableSlide.tsx
import React from "react";
import { motion } from "motion/react";
import { useSlideNavigation } from "../../context/SlideContext";
import { AGENTS, TRIGGER_CONFIG, AgentElement } from "../../constants/agents";
import { DOMAINS } from "../../constants/domains";
import { Zap, MessageCircle, Clock, User } from "lucide-react";

const DOMAIN_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  2: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  3: { bg: "bg-violet-50", text: "text-violet-800", border: "border-violet-200" },
  4: { bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
  5: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  6: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" },
  7: { bg: "bg-pink-50", text: "text-pink-800", border: "border-pink-200" },
  8: { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200" },
  9: { bg: "bg-cyan-50", text: "text-cyan-800", border: "border-cyan-200" },
  10: { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-300" },
};

const LAYER_DOTS: Record<number, string> = {
  1: "bg-emerald-500",
  2: "bg-blue-500",
  3: "bg-violet-500",
  4: "bg-amber-500",
};

const TRIGGER_ICONS = { event: Zap, chat: MessageCircle, scheduled: Clock };

const Element = ({ agent, index }: { agent: AgentElement; index: number }) => {
  const { goToSlide } = useSlideNavigation();
  const dc = DOMAIN_COLORS[agent.domain];
  const TriggerIcon = TRIGGER_ICONS[agent.triggerType];
  const num = agent.agentId.replace("A-", "");

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.008 }}
      onClick={() => goToSlide(agent.id)}
      className={`relative rounded-lg p-1.5 text-center cursor-pointer transition-all duration-200 border hover:scale-110 hover:z-10 hover:shadow-xl hover:border-primary ${dc.bg} ${dc.text} ${dc.border} flex flex-col items-center justify-center gap-0.5`}
      style={{ minHeight: "58px" }}
      title={`${agent.agentId}: ${agent.shortName}`}
    >
      {/* HITL marker */}
      {agent.hitl && (
        <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-pink-200 flex items-center justify-center">
          <User className="w-2 h-2 text-pink-700" />
        </div>
      )}

      {/* Agent ID */}
      <span className="font-headline font-extrabold text-[11px] leading-none">{num}</span>

      {/* Short name */}
      <span className="text-[7px] font-semibold leading-tight opacity-80 line-clamp-2">{agent.shortName}</span>

      {/* Layer dot */}
      <div className={`w-[5px] h-[5px] rounded-full ${LAYER_DOTS[agent.layer]}`} />

      {/* Trigger badge */}
      <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-1 py-px rounded text-[6px] font-bold ${
        agent.triggerType === "event" ? "bg-emerald-100 text-emerald-700" :
        agent.triggerType === "chat" ? "bg-blue-100 text-blue-700" :
        "bg-amber-100 text-amber-700"
      }`}>
        <TriggerIcon className="w-2 h-2" />
      </div>
    </motion.button>
  );
};

export const PeriodicTableSlide = () => {
  const stats = {
    total: AGENTS.length,
    hitl: AGENTS.filter(a => a.hitl).length,
    event: AGENTS.filter(a => a.triggerType === "event").length,
    chat: AGENTS.filter(a => a.triggerType === "chat").length,
    scheduled: AGENTS.filter(a => a.triggerType === "scheduled").length,
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-4 shrink-0">
        <h2 className="text-4xl font-headline font-bold mb-2">Agentic HR Capability Map</h2>
        <p className="text-lg text-secondary max-w-3xl">
          82 AI agents across 10 HR domains. Click any element to explore the deep dive.
        </p>
      </div>

      {/* Periodic Table Grid */}
      <div className="grid grid-cols-14 gap-1 mb-4 shrink-0">
        {AGENTS.map((agent, i) => (
          <Element key={agent.id} agent={agent} index={i} />
        ))}
      </div>

      {/* Legend + Stats */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        {/* Domain Legend */}
        <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <div className="text-[9px] font-bold uppercase tracking-widest text-secondary/50 mb-2">Domains</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {DOMAINS.map((d, i) => (
              <div key={d.id} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${DOMAIN_COLORS[i + 1]?.bg} ${DOMAIN_COLORS[i + 1]?.border} border`} />
                <span className="text-[8px] font-medium text-secondary truncate">{d.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Layer Legend */}
        <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <div className="text-[9px] font-bold uppercase tracking-widest text-secondary/50 mb-2">Implementation Layer</div>
          <div className="space-y-1.5">
            {[
              { l: 1, name: "OOTB — Ready to deploy", dot: "bg-emerald-500" },
              { l: 2, name: "Agent Designer — No-code", dot: "bg-blue-500" },
              { l: 3, name: "Custom ADK — Dev build", dot: "bg-violet-500" },
              { l: 4, name: "Data Agent — Analytics", dot: "bg-amber-500" },
            ].map(item => (
              <div key={item.l} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                <span className="text-[8px] font-medium text-secondary">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trigger Legend */}
        <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <div className="text-[9px] font-bold uppercase tracking-widest text-secondary/50 mb-2">Trigger Type</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-emerald-600" /><span className="text-[8px] font-medium text-secondary">Event-driven ({stats.event})</span></div>
            <div className="flex items-center gap-1.5"><MessageCircle className="w-3 h-3 text-blue-600" /><span className="text-[8px] font-medium text-secondary">Chat-initiated ({stats.chat})</span></div>
            <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-amber-600" /><span className="text-[8px] font-medium text-secondary">Scheduled ({stats.scheduled})</span></div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-3 rounded-xl bg-primary/5 border-2 border-primary/20">
          <div className="text-[9px] font-bold uppercase tracking-widest text-primary/50 mb-2">Landscape</div>
          <div className="space-y-1">
            <div className="flex justify-between"><span className="text-[9px] text-secondary">Total Agents</span><span className="text-sm font-headline font-extrabold text-primary">{stats.total}</span></div>
            <div className="flex justify-between"><span className="text-[9px] text-secondary">Domains</span><span className="text-sm font-headline font-extrabold text-primary">10</span></div>
            <div className="flex justify-between"><span className="text-[9px] text-secondary">HITL Checkpoints</span><span className="text-sm font-headline font-extrabold text-pink-600">{stats.hitl}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/slides/PeriodicTableSlide.tsx
git commit -m "Add PeriodicTableSlide component with 82-agent periodic table grid"
```

---

### Task 3: Build SwimlaneFlow component

**Files:**
- Create: `src/components/SwimlaneFlow.tsx`

The swimlane shows 3 horizontal lanes (Human / Agent / Systems) with nodes positioned in the correct lane and animated connections.

- [ ] **Step 1: Create the component**

```tsx
// src/components/SwimlaneFlow.tsx
import React from "react";
import { motion } from "motion/react";
import { User, Cpu, Settings, LucideIcon } from "lucide-react";

export interface SwimlaneNode {
  id: string;
  label: string;
  sublabel?: string;
  lane: "human" | "agent" | "system";
  type: "trigger" | "action" | "hitl" | "output";
  icon?: LucideIcon;
}

export interface SwimlaneFlow {
  nodes: SwimlaneNode[];
  connections: [string, string][];
}

interface SwimlaneFlowProps {
  flow: SwimlaneFlow;
  triggerType?: "event" | "chat" | "scheduled";
  hitl?: { actor: string; action: string; description: string };
}

const LANE_STYLES = {
  human: { bg: "bg-pink-50/80", border: "border-pink-200/50", label: "Human Actor", labelBg: "bg-pink-100 text-pink-800", icon: User },
  agent: { bg: "bg-blue-50/80", border: "border-blue-200/50", label: "Gemini Agent", labelBg: "bg-blue-100 text-blue-800", icon: Cpu },
  system: { bg: "bg-emerald-50/80", border: "border-emerald-200/50", label: "Systems", labelBg: "bg-emerald-100 text-emerald-800", icon: Settings },
};

const NODE_STYLES = {
  trigger: "bg-amber-50 border-amber-300 text-amber-900 rounded-full",
  action: "bg-blue-50 border-blue-300 text-blue-900 rounded-xl",
  hitl: "bg-pink-50 border-pink-400 text-pink-900 rounded-xl border-dashed",
  output: "bg-emerald-50 border-emerald-300 text-emerald-900 rounded-xl",
};

export const SwimlaneFlowComponent = ({ flow, triggerType, hitl }: SwimlaneFlowProps) => {
  const lanes: ("human" | "agent" | "system")[] = ["human", "agent", "system"];

  // Group nodes by lane, preserving order
  const nodesByLane = lanes.reduce((acc, lane) => {
    acc[lane] = flow.nodes.filter(n => n.lane === lane);
    return acc;
  }, {} as Record<string, SwimlaneNode[]>);

  // Calculate max nodes in any lane for column sizing
  const maxNodes = Math.max(...lanes.map(l => nodesByLane[l].length));

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-outline-variant/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-surface-container-low border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="font-headline font-bold uppercase tracking-wider text-[11px] text-secondary">Agent Architecture</span>
          </div>
          <div className="flex items-center gap-3 text-[9px]">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-400" /><span className="text-secondary">Human</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-secondary">Agent</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-secondary">System</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-2 rounded border border-dashed border-pink-400" /><span className="text-secondary">HITL Gate</span></div>
          </div>
        </div>

        {/* Lanes */}
        {lanes.map((lane, laneIdx) => {
          const config = LANE_STYLES[lane];
          const LaneIcon = config.icon;
          const nodes = nodesByLane[lane];

          return (
            <div key={lane} className={`flex items-stretch ${config.bg} ${laneIdx < 2 ? `border-b ${config.border}` : ""}`}>
              {/* Lane Label */}
              <div className={`w-24 shrink-0 flex flex-col items-center justify-center gap-1 p-2 border-r ${config.border}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.labelBg}`}>
                  <LaneIcon className="w-4 h-4" />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-center leading-tight opacity-70">{config.label}</span>
              </div>

              {/* Nodes in this lane */}
              <div className="flex-1 flex items-center gap-3 p-3 min-h-[64px]">
                {nodes.length === 0 ? (
                  <div className="flex-1" />
                ) : (
                  nodes.map((node, nIdx) => (
                    <React.Fragment key={node.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + (laneIdx * maxNodes + nIdx) * 0.06 }}
                        className={`px-3 py-2 border-2 text-center shrink-0 ${NODE_STYLES[node.type]}`}
                      >
                        <div className="font-headline font-bold text-[10px] leading-tight">{node.label}</div>
                        {node.sublabel && <div className="text-[8px] opacity-70 mt-0.5">{node.sublabel}</div>}
                      </motion.div>
                      {nIdx < nodes.length - 1 && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + nIdx * 0.08 }}
                          className="text-primary font-light text-lg"
                        >→</motion.span>
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* HITL Callout */}
      {hitl && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-pink-50/80 border-2 border-dashed border-pink-300"
        >
          <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-pink-700" />
          </div>
          <div>
            <div className="font-headline font-bold text-sm text-pink-900">Human-in-the-Loop: {hitl.actor}</div>
            <div className="text-xs text-pink-800 font-semibold mt-0.5">{hitl.action}</div>
            <div className="text-[11px] text-pink-700/80 mt-1">{hitl.description}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/SwimlaneFlow.tsx
git commit -m "Add SwimlaneFlow component with 3-lane visualization and HITL callouts"
```

---

### Task 4: Redesign UseCaseSlide with tabs, trigger/HITL badges, and swimlane

**Files:**
- Modify: `src/components/UseCaseSlide.tsx`

The slide gets a tabbed layout: Overview (existing content) and Agent Workflow (swimlane). New badges for trigger type and HITL appear in the header.

- [ ] **Step 1: Rewrite UseCaseSlide.tsx**

The full rewrite adds:
- `triggerType` prop with colored badge in header
- `hitl` prop with pink badge in header + callout in workflow tab
- `swimlane` prop for the SwimlaneFlow component
- Tab switching between "Overview" and "Agent Workflow"
- Keeps backward compat: old `flow` prop still renders ProcessFlow if no `swimlane` provided

```tsx
// src/components/UseCaseSlide.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Zap, Search, Settings, CheckCircle, Cpu, Layers, User, MessageCircle, Clock } from "lucide-react";
import { useSlideNavigation } from "../context/SlideContext";
import { ProcessFlow, FlowStep } from "./ProcessFlow";
import { SwimlaneFlowComponent, SwimlaneFlow } from "./SwimlaneFlow";
import { TriggerType, TRIGGER_CONFIG } from "../constants/agents";

export type AgentLayer = "Layer 1: OOTB" | "Layer 2: Agent Designer" | "Layer 3: Custom ADK" | "Layer 4: Data Agent";

interface KPI {
  label: string;
  before: string;
  after: string;
}

interface HITLConfig {
  actor: string;
  action: string;
  description: string;
}

interface UseCaseSlideProps {
  title: string;
  subtitle: string;
  statusQuo: string[];
  agentification: string[];
  icon: React.ElementType;
  domainId?: string;
  flow?: FlowStep[];
  layer?: AgentLayer;
  persona?: string;
  systems?: string[];
  kpis?: KPI[];
  triggerType?: TriggerType;
  hitl?: HITLConfig;
  swimlane?: SwimlaneFlow;
}

const LAYER_CONFIG: Record<AgentLayer, { color: string; bg: string; label: string; desc: string }> = {
  "Layer 1: OOTB": { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", label: "OOTB", desc: "Out-of-the-Box" },
  "Layer 2: Agent Designer": { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", label: "Agent Designer", desc: "No-Code Builder" },
  "Layer 3: Custom ADK": { color: "text-violet-700", bg: "bg-violet-50 border-violet-200", label: "Custom ADK", desc: "Developer Build" },
  "Layer 4: Data Agent": { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", label: "Data Agent", desc: "Analytics Engine" },
};

const TRIGGER_ICONS = { event: Zap, chat: MessageCircle, scheduled: Clock };
const TRIGGER_STYLES = {
  event: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", label: "Event-Driven" },
  chat: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", label: "Chat-Initiated" },
  scheduled: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", label: "Scheduled" },
};

const DEFAULT_FLOW: FlowStep[] = [
  { label: "Trigger", icon: Zap, description: "Event or request initiates workflow.", trigger: "Event-driven", systems: ["HRIS", "Slack"] },
  { label: "Analysis", icon: Search, description: "Agent reasons over context and data.", systems: ["Gemini"], integration: "Native API" },
  { label: "Action", icon: Settings, description: "Orchestrates across HR systems.", systems: ["ERP", "LMS"], output: "System Update" },
  { label: "Outcome", icon: CheckCircle, description: "Completed with audit trail.", output: "Audit Log" }
];

export const UseCaseSlide = ({ title, subtitle, statusQuo, agentification, icon: Icon, domainId, flow = DEFAULT_FLOW, layer, persona, systems, kpis, triggerType, hitl, swimlane }: UseCaseSlideProps) => {
  const { goToSlide } = useSlideNavigation();
  const layerInfo = layer ? LAYER_CONFIG[layer] : null;
  const triggerInfo = triggerType ? TRIGGER_STYLES[triggerType] : null;
  const TriggerIcon = triggerType ? TRIGGER_ICONS[triggerType] : null;
  const [activeTab, setActiveTab] = useState<"overview" | "workflow">("overview");

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center shadow-lg shadow-primary/20">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-headline font-bold leading-tight">{title}</h2>
            <p className="text-secondary text-[10px] uppercase tracking-widest font-mono">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Trigger Badge */}
          {triggerInfo && TriggerIcon && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${triggerInfo.bg} ${triggerInfo.color}`}>
              <TriggerIcon className="w-3 h-3" />
              {triggerInfo.label}
            </div>
          )}

          {/* Layer Badge */}
          {layerInfo && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${layerInfo.bg} ${layerInfo.color}`}>
              <Layers className="w-3 h-3" />
              {layerInfo.label}
            </div>
          )}

          {/* HITL Badge */}
          {hitl && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-pink-200 bg-pink-50 text-[9px] font-bold uppercase tracking-wider text-pink-700">
              <User className="w-3 h-3" />
              HITL: {hitl.actor}
            </div>
          )}

          {/* Persona Badge */}
          {persona && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-outline-variant/40 bg-surface-container-low text-[9px] font-bold uppercase tracking-wider text-secondary">
              <User className="w-3 h-3" />
              {persona}
            </div>
          )}

          {domainId && (
            <button
              onClick={() => goToSlide(domainId)}
              className="flex items-center gap-1 px-3 py-1 rounded-full glass-panel hover:bg-surface-container font-bold transition-colors text-[9px] uppercase tracking-wider text-secondary hover:text-primary"
            >
              <ArrowLeft className="w-3 h-3" />
              Domain
            </button>
          )}
        </div>
      </div>

      {/* Systems Strip */}
      {systems && systems.length > 0 && (
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <span className="text-[8px] font-bold uppercase tracking-widest text-secondary/50">Integrations:</span>
          <div className="flex gap-1 flex-wrap">
            {systems.map((sys, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded-md bg-surface-container border border-outline-variant/30 text-[8px] font-bold text-secondary/80 uppercase tracking-wide">
                {sys}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 shrink-0">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-headline font-bold uppercase tracking-wider transition-all ${
            activeTab === "overview"
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-surface-container-low text-secondary hover:text-primary border border-outline-variant/30"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("workflow")}
          className={`px-4 py-2 rounded-xl text-xs font-headline font-bold uppercase tracking-wider transition-all ${
            activeTab === "workflow"
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-surface-container-low text-secondary hover:text-primary border border-outline-variant/30"
          }`}
        >
          Agent Workflow
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-4 flex-1"
          >
            {/* Before/After */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-tertiary">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-headline font-bold uppercase tracking-wider text-[10px]">Today — Manual Process</span>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {statusQuo.map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-secondary text-[13px] leading-relaxed">
                      <div className="w-5 h-5 rounded-md bg-tertiary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[8px] font-bold text-tertiary">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-primary/5 border-2 border-primary/20 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 hero-gradient opacity-[0.03] rounded-full translate-x-1/3 -translate-y-1/3 w-48 h-48" />
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <Cpu className="w-4 h-4" />
                  <span className="font-headline font-bold uppercase tracking-wider text-[10px]">With Agent — Autonomous</span>
                </div>
                <ul className="space-y-2.5 flex-1 relative z-10">
                  {agentification.map((item, i) => (
                    <li key={i} className="flex gap-2.5 font-medium text-[13px] leading-relaxed">
                      <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* KPIs */}
            {kpis && kpis.length > 0 && (
              <div className="grid gap-3 shrink-0" style={{ gridTemplateColumns: `repeat(${Math.min(kpis.length, 4)}, 1fr)` }}>
                {kpis.map((kpi, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
                    <div className="text-[8px] font-bold uppercase tracking-widest text-secondary/50 mb-1.5">{kpi.label}</div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-base font-headline font-bold text-tertiary/60 line-through decoration-tertiary/30">{kpi.before}</span>
                      <ArrowRight className="w-3 h-3 text-primary" />
                      <span className="text-base font-headline font-extrabold text-primary">{kpi.after}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="workflow"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex-1"
          >
            {swimlane ? (
              <SwimlaneFlowComponent flow={swimlane} triggerType={triggerType} hitl={hitl} />
            ) : (
              <ProcessFlow steps={flow} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/UseCaseSlide.tsx
git commit -m "Redesign UseCaseSlide with tabbed layout, trigger/HITL badges, and swimlane support"
```

---

### Task 5: Wire PeriodicTableSlide into slides.tsx

**Files:**
- Modify: `src/config/slides.tsx`

Replace the DomainMapSlide import with PeriodicTableSlide.

- [ ] **Step 1: Update slides.tsx**

In `src/config/slides.tsx`, change:

```ts
// Old:
import { DomainMapSlide } from "../components/slides/DomainMapSlide";
// New:
import { PeriodicTableSlide } from "../components/slides/PeriodicTableSlide";
```

And in the SLIDES array, change:

```ts
// Old:
{ id: "domain-map", title: "HR Ecosystem Map", content: <DomainMapSlide /> },
// New:
{ id: "domain-map", title: "HR Capability Map", content: <PeriodicTableSlide /> },
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit && npx vite build`
Expected: Clean build

- [ ] **Step 3: Commit**

```bash
git add src/config/slides.tsx
git commit -m "Replace DomainMapSlide with PeriodicTableSlide in slide deck"
```

---

### Task 6: Add triggerType, hitl, and swimlane to Domain 1-2 use cases (21 files)

**Files:**
- Modify: All 8 Domain 1 + 13 Domain 2 use case files in `src/components/slides/use-cases/`

For each file:
1. Add `import { SwimlaneFlow } from "../../SwimlaneFlow";`
2. Define a `swimlane` constant with nodes and connections
3. Add `triggerType`, `hitl` (where applicable), and `swimlane` props to the `UseCaseSlide` call
4. Keep all existing props (statusQuo, agentification, kpis, flow, layer, persona, systems)

The trigger types and HITL data match what's defined in `agents.ts` (Task 1). The swimlane nodes should reflect the existing `flow` steps but placed in the correct lanes.

**Pattern for each file** (using WorkforceScenarioModeling.tsx as example):

```tsx
// Add import at top:
import { SwimlaneFlow } from "../../SwimlaneFlow";

// Add swimlane constant before component:
const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "t1", label: "Business Signals", sublabel: "Revenue, attrition, market", lane: "system", type: "trigger" },
    { id: "a1", label: "Demand Modeling", sublabel: "Multi-variable forecast", lane: "agent", type: "action" },
    { id: "a2", label: "Gap Analysis", sublabel: "Skills, headcount, location", lane: "agent", type: "action" },
    { id: "a3", label: "Strategy Output", sublabel: "Build vs Buy vs Bot", lane: "agent", type: "output" },
    { id: "h1", label: "CHRO Reviews Plan", sublabel: "Strategic validation", lane: "human", type: "output" },
  ],
  connections: [["t1","a1"],["a1","a2"],["a2","a3"],["a3","h1"]],
};

// Add to UseCaseSlide props:
triggerType="scheduled"
swimlane={swimlane}
```

For HITL agents, also add:
```tsx
hitl={{ actor: "Recruiter", action: "Review shortlist", description: "Agent pauses after generating ranked shortlist. Recruiter reviews recommendations and approves." }}
```

- [ ] **Step 1: Update all 21 files with swimlane data, triggerType, and hitl props**

Each file needs a unique swimlane reflecting its specific workflow. Use the existing `flow` steps as a guide — map each step to the correct lane (trigger events → system, agent analysis → agent, human review → human, system outputs → system).

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/slides/use-cases/
git commit -m "Add swimlane, triggerType, and HITL data to Domain 1-2 use cases (21 files)"
```

---

### Task 7: Add triggerType, hitl, and swimlane to Domain 3-4 use cases (20 files)

**Files:**
- Modify: All 11 Domain 3 + 9 Domain 4 use case files in `src/components/slides/use-cases/`

Same pattern as Task 6. Each file gets:
- `import { SwimlaneFlow } from "../../SwimlaneFlow";`
- A `swimlane` constant with lane-appropriate nodes
- `triggerType` and `hitl` props where applicable

Trigger types and HITL data per `agents.ts`.

- [ ] **Step 1: Update all 20 files**
- [ ] **Step 2: Verify build** — `npx tsc --noEmit`
- [ ] **Step 3: Commit**

```bash
git add src/components/slides/use-cases/
git commit -m "Add swimlane, triggerType, and HITL data to Domain 3-4 use cases (20 files)"
```

---

### Task 8: Add triggerType, hitl, and swimlane to Domain 5-7 use cases (23 files)

**Files:**
- Modify: All 8 Domain 5 + 8 Domain 6 + 7 Domain 7 use case files

Same pattern as Tasks 6-7.

- [ ] **Step 1: Update all 23 files**
- [ ] **Step 2: Verify build** — `npx tsc --noEmit`
- [ ] **Step 3: Commit**

```bash
git add src/components/slides/use-cases/
git commit -m "Add swimlane, triggerType, and HITL data to Domain 5-7 use cases (23 files)"
```

---

### Task 9: Add triggerType, hitl, and swimlane to Domain 8-10 use cases (18 files)

**Files:**
- Modify: All 9 Domain 8 + 4 Domain 9 + 5 Domain 10 use case files

Same pattern as Tasks 6-8.

- [ ] **Step 1: Update all 18 files**
- [ ] **Step 2: Verify build** — `npx tsc --noEmit`
- [ ] **Step 3: Commit**

```bash
git add src/components/slides/use-cases/
git commit -m "Add swimlane, triggerType, and HITL data to Domain 8-10 use cases (18 files)"
```

---

### Task 10: Final build verification and cleanup

**Files:**
- Possibly modify: `src/index.css` (if any new Tailwind classes need theme extensions)
- Verify: Full production build

- [ ] **Step 1: Full type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Production build**

Run: `npx vite build`
Expected: Successful build

- [ ] **Step 3: Add .superpowers to .gitignore if not already there**

```bash
echo ".superpowers/" >> .gitignore
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "Periodic table + deep dive redesign complete: 82 agents with swimlane workflows, trigger types, and HITL gates"
```
