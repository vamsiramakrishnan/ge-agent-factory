# Agent Deep Dive Single-Scroll Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3-tab agent view with a single-scroll layout and add rich architecture visualizations (hub-spoke integration map + data flow pipeline) to every agent.

**Architecture:** New types (`SystemConnection`, `PipelineStage`, `AgentArchitecture`) are added to a shared types file. Two new components (`HubSpokeMap`, `DataFlowPipeline`) render the architecture section. `UseCaseSlide` is rewritten to stack all 5 sections vertically. Existing agent components gain an optional `architecture` prop — backward compatible.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Motion (Framer Motion), Lucide React

**Spec:** `docs/design-specs/specs/2026-04-13-agent-deep-dive-design.md`

---

## Task 1: Add Architecture Types

**Files:**
- Create: `src/types/architecture.ts`

- [ ] **Step 1: Create the architecture types file**

```typescript
// src/types/architecture.ts
import { LucideIcon } from "lucide-react";

export type SystemCategory = "erp" | "analytics" | "ai" | "clm" | "market-data" | "collaboration";
export type PipelineLayer = "integration" | "ml" | "llm";
export type ConnectionDirection = "read" | "write" | "bidirectional";

export interface SystemConnection {
  system: string;
  description: string;
  direction: ConnectionDirection;
  protocol?: string;
  dataExamples?: string[];
  category: SystemCategory;
}

export interface PipelineStage {
  label: string;
  description: string;
  systems: string[];
  layer: PipelineLayer;
  dataIn?: string;
  dataOut?: string;
}

export interface AgentArchitecture {
  connections: SystemConnection[];
  pipeline: PipelineStage[];
}

export const CATEGORY_STYLES: Record<SystemCategory, { color: string; border: string; bg: string }> = {
  erp: { color: "#3b82f6", border: "border-blue-400", bg: "bg-blue-50" },
  analytics: { color: "#f59e0b", border: "border-amber-400", bg: "bg-amber-50" },
  ai: { color: "#8b5cf6", border: "border-violet-400", bg: "bg-violet-50" },
  clm: { color: "#ef4444", border: "border-red-400", bg: "bg-red-50" },
  "market-data": { color: "#10b981", border: "border-emerald-400", bg: "bg-emerald-50" },
  collaboration: { color: "#06b6d4", border: "border-cyan-400", bg: "bg-cyan-50" },
};

export const PIPELINE_STYLES: Record<PipelineLayer, { label: string; bg: string; border: string; textColor: string }> = {
  integration: { label: "Integration & Orchestration", bg: "bg-blue-50", border: "border-blue-200", textColor: "text-blue-700" },
  ml: { label: "Traditional ML / Analytics", bg: "bg-violet-50", border: "border-violet-200", textColor: "text-violet-700" },
  llm: { label: "LLM Reasoning", bg: "bg-amber-50/80", border: "border-amber-400", textColor: "text-amber-800" },
};
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /home/user/fde-agent-factory && npx tsc --noEmit src/types/architecture.ts 2>&1 | head -5`

- [ ] **Step 3: Commit**

```bash
git add src/types/architecture.ts
git commit -m "feat: add architecture types for agent deep dive"
```

---

## Task 2: Build HubSpokeMap Component

**Files:**
- Create: `src/components/HubSpokeMap.tsx`

**Context:** This component renders a radial diagram with the agent at center and connected systems as spokes. Each system node shows the vendor name, data description, and connection direction. The `category` field determines the node's color. Direction is shown via line style: dashed = read, solid = write, double = bidirectional. Read the spec section "Category Colors & Icons" in `docs/design-specs/specs/2026-04-13-agent-deep-dive-design.md` for the color mapping.

- [ ] **Step 1: Create the component**

```tsx
// src/components/HubSpokeMap.tsx
import React from "react";
import { motion } from "motion/react";
import { Cpu, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Database, BarChart3, Brain, FileSignature, TrendingUp, MessageSquare } from "lucide-react";
import { SystemConnection, CATEGORY_STYLES, SystemCategory } from "../types/architecture";

interface HubSpokeMapProps {
  connections: SystemConnection[];
  agentName: string;
  agentIcon: React.ElementType;
}

const CATEGORY_ICONS: Record<SystemCategory, React.ElementType> = {
  erp: Database,
  analytics: BarChart3,
  ai: Brain,
  clm: FileSignature,
  "market-data": TrendingUp,
  collaboration: MessageSquare,
};

const DIRECTION_CONFIG = {
  read: { icon: ArrowDownLeft, label: "reads", lineClass: "stroke-dasharray: 4 3" },
  write: { icon: ArrowUpRight, label: "writes", lineClass: "" },
  bidirectional: { icon: ArrowLeftRight, label: "read/write", lineClass: "" },
};

// Distribute spokes evenly around the hub
const getSpokePosition = (index: number, total: number, radius: number) => {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // start from top
  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * Math.sin(angle),
  };
};

export const HubSpokeMap = ({ connections, agentName, agentIcon: AgentIcon }: HubSpokeMapProps) => {
  const radius = 38; // percentage from center

  return (
    <div className="relative w-full" style={{ paddingBottom: "100%" }}>
      <div className="absolute inset-0">
        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
          {connections.map((conn, i) => {
            const pos = getSpokePosition(i, connections.length, radius);
            const style = CATEGORY_STYLES[conn.category];
            const isRead = conn.direction === "read";
            const isBidi = conn.direction === "bidirectional";
            return (
              <line
                key={i}
                x1="50" y1="50"
                x2={pos.x} y2={pos.y}
                stroke={style.color}
                strokeWidth={isBidi ? 0.6 : 0.4}
                strokeDasharray={isRead ? "1.5 1" : "none"}
                opacity={0.4}
              />
            );
          })}
        </svg>

        {/* Center hub */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="absolute rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex flex-col items-center justify-center text-white shadow-lg shadow-blue-600/25 z-10"
          style={{ width: "18%", height: "18%", left: "41%", top: "41%" }}
        >
          <AgentIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[5px] font-bold uppercase tracking-wider text-center leading-tight px-1 opacity-90">{agentName}</span>
        </motion.div>

        {/* Spoke nodes */}
        {connections.map((conn, i) => {
          const pos = getSpokePosition(i, connections.length, radius);
          const style = CATEGORY_STYLES[conn.category];
          const CategoryIcon = CATEGORY_ICONS[conn.category];
          const dirConfig = DIRECTION_CONFIG[conn.direction];
          const DirIcon = dirConfig.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.25 }}
              className="absolute flex flex-col items-center text-center z-5"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                width: "22%",
              }}
            >
              {/* System icon */}
              <div
                className="w-8 h-8 rounded-lg border-2 bg-white flex items-center justify-center shadow-sm mb-0.5"
                style={{ borderColor: style.color }}
              >
                <CategoryIcon className="w-4 h-4" style={{ color: style.color }} />
              </div>
              {/* System name */}
              <span className="text-[6px] font-bold text-gray-700 leading-tight">{conn.system}</span>
              {/* Data description */}
              <span className="text-[5px] text-gray-400 leading-tight mt-px">{conn.description}</span>
              {/* Direction + protocol */}
              <div className="flex items-center gap-0.5 mt-0.5">
                <DirIcon className="w-2 h-2" style={{ color: style.color }} />
                {conn.protocol && (
                  <span className="text-[4px] font-mono px-1 py-px rounded bg-gray-100 text-gray-400">{conn.protocol}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /home/user/fde-agent-factory && npx tsc --noEmit src/components/HubSpokeMap.tsx 2>&1 | head -5`

- [ ] **Step 3: Commit**

```bash
git add src/components/HubSpokeMap.tsx
git commit -m "feat: add HubSpokeMap component for agent architecture visualization"
```

---

## Task 3: Build DataFlowPipeline Component

**Files:**
- Create: `src/components/DataFlowPipeline.tsx`

**Context:** Vertical stack of pipeline stages, each color-coded by layer (integration/ml/llm). The LLM stage gets a gold gradient and thicker border. Each stage shows dataIn → dataOut transformation. Read the spec section "Pipeline Layer Colors" for styling.

- [ ] **Step 1: Create the component**

```tsx
// src/components/DataFlowPipeline.tsx
import React from "react";
import { motion } from "motion/react";
import { ChevronDown, Sparkles } from "lucide-react";
import { PipelineStage, PIPELINE_STYLES } from "../types/architecture";

interface DataFlowPipelineProps {
  stages: PipelineStage[];
}

export const DataFlowPipeline = ({ stages }: DataFlowPipelineProps) => (
  <div className="flex flex-col gap-1">
    {stages.map((stage, i) => {
      const style = PIPELINE_STYLES[stage.layer];
      const isLLM = stage.layer === "llm";

      return (
        <React.Fragment key={i}>
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.2 }}
            className={`p-3 rounded-xl border ${isLLM ? "border-2" : ""} ${style.bg} ${style.border} relative`}
            style={isLLM ? { background: "linear-gradient(135deg, #fefce8, #fef3c7)" } : undefined}
          >
            {/* Stage label */}
            <div className={`flex items-center gap-1.5 mb-1 ${style.textColor}`}>
              {isLLM && <Sparkles className="w-3 h-3" />}
              <span className="text-[8px] font-bold uppercase tracking-wider">
                {isLLM ? `${stage.label} ✦` : stage.label}
              </span>
              <span className="text-[7px] opacity-50 font-normal ml-1">
                {style.label}
              </span>
            </div>

            {/* Description */}
            <p className="text-[9px] text-gray-600 leading-snug mb-1.5">{stage.description}</p>

            {/* Data In / Out */}
            {(stage.dataIn || stage.dataOut) && (
              <div className="flex items-center gap-2 text-[7px]">
                {stage.dataIn && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/60 border border-gray-200/50">
                    <span className="text-gray-400 font-bold">IN:</span>
                    <span className="text-gray-500">{stage.dataIn}</span>
                  </div>
                )}
                {stage.dataOut && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/60 border border-gray-200/50">
                    <span className="text-gray-400 font-bold">OUT:</span>
                    <span className="text-gray-500">{stage.dataOut}</span>
                  </div>
                )}
              </div>
            )}

            {/* Systems */}
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {stage.systems.map((sys, j) => (
                <span key={j} className="text-[6px] font-bold px-1.5 py-0.5 rounded bg-white/50 text-gray-400 uppercase tracking-wider">
                  {sys}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Arrow connector */}
          {i < stages.length - 1 && (
            <div className="flex justify-center py-0">
              <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
            </div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /home/user/fde-agent-factory && npx tsc --noEmit src/components/DataFlowPipeline.tsx 2>&1 | head -5`

- [ ] **Step 3: Commit**

```bash
git add src/components/DataFlowPipeline.tsx
git commit -m "feat: add DataFlowPipeline component for agent data flow visualization"
```

---

## Task 4: Rewrite UseCaseSlide as Single-Scroll Layout

**Files:**
- Modify: `src/components/UseCaseSlide.tsx`

**Context:** Remove the 3-tab structure. Render all content in a single scrollable column: Before/After → KPIs → Swimlane → Architecture (if provided) → Systems + HITL. The `architecture` prop is optional. Read the full current file at `src/components/UseCaseSlide.tsx` (391 lines) — it's being completely rewritten.

- [ ] **Step 1: Rewrite UseCaseSlide.tsx**

The complete rewritten file:

```tsx
import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Cpu, Layers, User, MessageCircle, Clock, ChevronRight, Zap, Settings } from "lucide-react";
import { useSlideNavigation } from "../context/SlideContext";
import { SwimlaneFlowComponent, SwimlaneFlow } from "./SwimlaneFlow";
import { FlowStep } from "./ProcessFlow";
import { TriggerType, AGENTS } from "../constants/agents";
import { HubSpokeMap } from "./HubSpokeMap";
import { DataFlowPipeline } from "./DataFlowPipeline";
import { AgentArchitecture } from "../types/architecture";

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

export interface UseCaseSlideProps {
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
  architecture?: AgentArchitecture;
}

const LAYER_CONFIG: Record<AgentLayer, { color: string; bg: string; label: string; desc: string }> = {
  "Layer 1: OOTB": { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", label: "OOTB", desc: "Ready to deploy" },
  "Layer 2: Agent Designer": { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", label: "Agent Designer", desc: "No-code" },
  "Layer 3: Custom ADK": { color: "text-violet-700", bg: "bg-violet-50 border-violet-200", label: "Custom ADK", desc: "Dev build" },
  "Layer 4: Data Agent": { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", label: "Data Agent", desc: "Analytics" },
};

const TRIGGER_ICONS = { event: Zap, chat: MessageCircle, scheduled: Clock };
const TRIGGER_STYLES = {
  event: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", label: "Event-Driven" },
  chat: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", label: "Chat-Initiated" },
  scheduled: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", label: "Scheduled" },
};

const SectionLabel = ({ children }: { children: string }) => (
  <div className="flex items-center gap-2 shrink-0">
    <span className="text-[8px] font-bold uppercase tracking-widest text-secondary/40">{children}</span>
    <div className="flex-1 h-px bg-outline-variant/15" />
  </div>
);

export const UseCaseSlide = ({ title, subtitle, statusQuo, agentification, icon: Icon, domainId, flow, layer, persona, systems, kpis, triggerType, hitl, swimlane, architecture }: UseCaseSlideProps) => {
  const { goToSlide, nextSlide, prevSlide } = useSlideNavigation();
  const layerInfo = layer ? LAYER_CONFIG[layer] : null;
  const triggerInfo = triggerType ? TRIGGER_STYLES[triggerType] : null;
  const TriggerIcon = triggerType ? TRIGGER_ICONS[triggerType] : null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto space-y-2.5">
      {/* ═══ HEADER ═══ */}
      <div className="flex items-start justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-headline font-bold leading-tight truncate">{title}</h2>
            <p className="text-secondary text-[9px] uppercase tracking-widest font-mono">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end max-w-[55%]">
          {triggerInfo && TriggerIcon && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-wider ${triggerInfo.bg} ${triggerInfo.color}`}>
              <TriggerIcon className="w-2.5 h-2.5" />
              {triggerInfo.label}
            </div>
          )}
          {layerInfo && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-wider ${layerInfo.bg} ${layerInfo.color}`}>
              <Layers className="w-2.5 h-2.5" />
              {layerInfo.label}
            </div>
          )}
          {hitl && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-pink-200 bg-pink-50 text-[8px] font-bold uppercase tracking-wider text-pink-700">
              <User className="w-2.5 h-2.5" />
              HITL
            </div>
          )}
          {persona && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-outline-variant/30 bg-surface-container-low text-[8px] font-bold uppercase tracking-wider text-secondary">
              {persona}
            </div>
          )}
          {domainId && (
            <button onClick={() => goToSlide(domainId)} className="flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-surface-container font-bold transition-colors text-[8px] uppercase tracking-wider text-secondary/60 hover:text-primary border border-outline-variant/20">
              <ArrowLeft className="w-2.5 h-2.5" />
              Back
            </button>
          )}
          <div className="flex gap-1 ml-1">
            <button onClick={prevSlide} className="p-1 rounded-md hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-3 h-3 text-secondary/40" />
            </button>
            <button onClick={nextSlide} className="p-1 rounded-md hover:bg-surface-container-low transition-colors">
              <ArrowRight className="w-3 h-3 text-secondary/40" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 1: BEFORE / AFTER ═══ */}
      <SectionLabel>Status Quo vs. Agent</SectionLabel>
      <div className="grid grid-cols-2 gap-2.5 shrink-0">
        <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
          <div className="flex items-center gap-1.5 mb-2 text-tertiary">
            <AlertCircle className="w-3 h-3" />
            <span className="font-headline font-bold uppercase tracking-wider text-[8px]">Today — Manual</span>
          </div>
          <ul className="space-y-1.5">
            {statusQuo.map((item, i) => (
              <li key={i} className="flex gap-2 text-secondary text-[10px] leading-snug">
                <div className="w-3.5 h-3.5 rounded bg-tertiary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[6px] font-bold text-tertiary">{String(i + 1).padStart(2, '0')}</span>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-3 rounded-xl bg-primary/5 border-2 border-primary/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 hero-gradient opacity-[0.03] rounded-full translate-x-1/3 -translate-y-1/3 w-32 h-32" />
          <div className="flex items-center gap-1.5 mb-2 text-primary">
            <Cpu className="w-3 h-3" />
            <span className="font-headline font-bold uppercase tracking-wider text-[8px]">With Agent — Autonomous</span>
          </div>
          <ul className="space-y-1.5 relative z-10">
            {agentification.map((item, i) => (
              <li key={i} className="flex gap-2 font-medium text-[10px] leading-snug">
                <div className="w-3.5 h-3.5 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ═══ SECTION 2: KPIs ═══ */}
      {kpis && kpis.length > 0 && (
        <>
          <SectionLabel>Impact Metrics</SectionLabel>
          <div className="grid gap-2 shrink-0" style={{ gridTemplateColumns: `repeat(${Math.min(kpis.length, 4)}, 1fr)` }}>
            {kpis.map((kpi, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15 text-center">
                <div className="text-[7px] font-bold uppercase tracking-widest text-secondary/40 mb-1">{kpi.label}</div>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xs font-headline font-bold text-tertiary/50 line-through decoration-tertiary/20">{kpi.before}</span>
                  <ChevronRight className="w-2.5 h-2.5 text-primary/50" />
                  <span className="text-xs font-headline font-extrabold text-primary">{kpi.after}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ═══ SECTION 3: AGENT WORKFLOW ═══ */}
      {swimlane && (
        <>
          <SectionLabel>Agent Workflow</SectionLabel>
          <div className="shrink-0">
            <SwimlaneFlowComponent flow={swimlane} triggerType={triggerType} hitl={hitl} />
          </div>
        </>
      )}

      {/* ═══ SECTION 4: ARCHITECTURE ═══ */}
      {architecture && (
        <>
          <SectionLabel>Data Flow & System Architecture</SectionLabel>
          <div className="grid grid-cols-2 gap-2.5 shrink-0">
            <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/15 p-3">
              <div className="text-[8px] font-bold uppercase tracking-widest text-secondary/40 mb-2">System Integration Map</div>
              <HubSpokeMap
                connections={architecture.connections}
                agentName={title.length > 20 ? title.split(" ").slice(0, 2).join(" ") : title}
                agentIcon={Icon}
              />
            </div>
            <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/15 p-3">
              <div className="text-[8px] font-bold uppercase tracking-widest text-secondary/40 mb-2">Data Flow Pipeline</div>
              <DataFlowPipeline stages={architecture.pipeline} />
            </div>
          </div>
        </>
      )}

      {/* ═══ SECTION 5: SYSTEMS & GOVERNANCE ═══ */}
      <SectionLabel>Systems & Governance</SectionLabel>
      <div className={`grid gap-2.5 shrink-0 ${hitl ? "grid-cols-2" : "grid-cols-1"}`}>
        <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/15">
          <div className="text-[8px] font-bold uppercase tracking-widest text-secondary/40 mb-2">System Integrations</div>
          {systems && systems.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {systems.map((sys, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-container-lowest border border-outline-variant/10">
                  <Settings className="w-3 h-3 text-primary/40" />
                  <span className="text-[9px] font-bold">{sys}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[9px] text-secondary/50">No system integrations specified</p>
          )}
        </div>
        {hitl && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-pink-50/80 border-2 border-dashed border-pink-300/50">
            <div className="w-7 h-7 rounded-full bg-pink-200 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-pink-700" />
            </div>
            <div>
              <div className="font-headline font-bold text-[10px] text-pink-900">Human-in-the-Loop: {hitl.actor}</div>
              <div className="text-[9px] text-pink-800 font-semibold mt-0.5">{hitl.action}</div>
              <div className="text-[8px] text-pink-700/70 mt-1 leading-snug">{hitl.description}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Build the full app to verify**

Run: `cd /home/user/fde-agent-factory && npm run build 2>&1 | tail -5`
Expected: Build succeeds with no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/UseCaseSlide.tsx
git commit -m "feat: rewrite UseCaseSlide as single-scroll layout with architecture section"
```

---

## Task 5: Add Architecture Data to Pilot Agent (CategoryStrategyGenerator)

**Files:**
- Modify: `src/components/slides/use-cases/procurement/CategoryStrategyGenerator.tsx`

**Context:** Add `architecture` prop to one agent as a pilot to validate the visual. Read the spec's example data in the "Example Data" section of `docs/design-specs/specs/2026-04-13-agent-deep-dive-design.md` for the pattern to follow. This component currently lives at the path above and uses `../../../UseCaseSlide` imports.

- [ ] **Step 1: Add architecture data to CategoryStrategyGenerator**

Add the import and architecture data. Read the current file first, then add the `architecture` prop to the `<UseCaseSlide>` call. The architecture data should be:

```tsx
import { AgentArchitecture } from "../../../types/architecture";

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP Ariba", description: "Historical category spend, supplier data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Coupa", description: "Requisition history, contract coverage", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Enriched spend cube, trend analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI", description: "Strategy narrative generation, savings reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "S&P Global Platts", description: "Commodity price indices, market trends", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Google Slides", description: "Board-ready strategy presentation output", direction: "write", protocol: "Workspace API", category: "collaboration" },
  ],
  pipeline: [
    { label: "Spend Aggregation", description: "Pull 3 years of category spend from Ariba and Coupa. Enrich with UNSPSC classification and supplier entity resolution from BigQuery spend cube.", systems: ["SAP Ariba", "Coupa", "BigQuery"], layer: "integration", dataIn: "Raw PO/invoice data across systems", dataOut: "Unified spend cube by supplier × category × BU" },
    { label: "Market Intelligence Synthesis", description: "Aggregate commodity price trends, supplier financial signals, and competitive landscape data. Time-series analysis on key indices.", systems: ["S&P Global Platts", "BigQuery ML"], layer: "ml", dataIn: "Commodity feeds + supplier financials", dataOut: "Market context with trend forecasts" },
    { label: "Strategy Narrative Generation", description: "Gemini reasons about which savings levers are realistic given category maturity — consolidation vs. spec change vs. demand management. Drafts strategy document with trade-offs, not just data.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Spend cube + market context + supplier scores", dataOut: "Category strategy document with savings targets" },
    { label: "Delivery & Review", description: "Strategy document formatted as board-ready presentation and delivered to Category Director for validation before stakeholder distribution.", systems: ["Google Slides", "Email"], layer: "integration", dataIn: "Approved strategy narrative", dataOut: "Distributed strategy deck" },
  ],
};
```

Add `architecture={architecture}` to the `<UseCaseSlide>` props.

- [ ] **Step 2: Build and verify**

Run: `cd /home/user/fde-agent-factory && npm run build 2>&1 | tail -5`

- [ ] **Step 3: Visually verify in browser**

Open the app, navigate to Domain 12 → Category Strategy Generator. Verify:
1. Single scroll layout with all 5 sections
2. Hub-spoke map shows 6 systems with correct colors and direction badges
3. Data flow pipeline shows 4 stages with LLM stage highlighted in gold
4. Systems & Governance section shows system chips and HITL card

- [ ] **Step 4: Commit**

```bash
git add src/components/slides/use-cases/procurement/CategoryStrategyGenerator.tsx
git commit -m "feat: add architecture data to CategoryStrategyGenerator as pilot"
```

---

## Task 6: Add Architecture Data to Remaining Domain 11 Agents (6 agents)

**Files:**
- Modify: `src/components/slides/use-cases/procurement/DemandForecastingAggregation.tsx`
- Modify: `src/components/slides/use-cases/procurement/MakeVsBuyAnalyzer.tsx`
- Modify: `src/components/slides/use-cases/procurement/ProcurementPolicyAssistant.tsx`
- Modify: `src/components/slides/use-cases/procurement/SavingsPipelineTracker.tsx`
- Modify: `src/components/slides/use-cases/procurement/ProcurementMaturityAssessor.tsx`
- Modify: `src/components/slides/use-cases/procurement/StakeholderSatisfactionAnalyzer.tsx`

**Context:** Add `architecture` prop to each agent. Read the spec at `docs/design-specs/specs/2026-04-13-procurement-agent-catalog.md` sections P1-02 through P1-07 for each agent's systems, AI techniques, and three-layer breakdown. Use this information to create accurate `connections` (systems the agent integrates with) and `pipeline` (data processing stages mapped to integration/ml/llm layers). Each agent must have 4-6 connections and 3-4 pipeline stages.

For each agent file:
1. Read the current file to understand existing props
2. Add `import { AgentArchitecture } from "../../../types/architecture";`
3. Create an `architecture` constant with connections and pipeline data from the spec
4. Add `architecture={architecture}` to the `<UseCaseSlide>` props

- [ ] **Step 1: Add architecture to all 6 agents**
- [ ] **Step 2: Build and verify** — `npm run build`
- [ ] **Step 3: Commit** — `"feat: add architecture data to Domain 11 agents (6 remaining)"`

---

## Task 7-14: Add Architecture Data to Domains 12-19

Each task follows the same pattern as Task 6 — add `architecture` data to all agents in that domain.

### Task 7: Domain 12 — Strategic Sourcing (12 agents)
**Reference:** Spec sections P2-01 through P2-12. Read each agent's file, add architecture data matching the three-layer breakdown.
- [ ] **Step 1: Add architecture to all 12 agents**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit** — `"feat: add architecture data to Domain 12 agents (12 agents)"`

### Task 8: Domain 13 — Supplier Discovery (8 agents)
**Reference:** Spec sections P3-01 through P3-08.
- [ ] **Step 1: Add architecture to all 8 agents**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit** — `"feat: add architecture data to Domain 13 agents (8 agents)"`

### Task 9: Domain 14 — Contract Lifecycle (9 agents)
**Reference:** Spec sections P4-01 through P4-09.
- [ ] **Step 1: Add architecture to all 9 agents**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit** — `"feat: add architecture data to Domain 14 agents (9 agents)"`

### Task 10: Domain 15 — Procure-to-Pay (11 agents)
**Reference:** Spec sections P5-01 through P5-11.
- [ ] **Step 1: Add architecture to all 11 agents**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit** — `"feat: add architecture data to Domain 15 agents (11 agents)"`

### Task 11: Domain 16 — Supplier Risk (8 agents)
**Reference:** Spec sections P6-01 through P6-08.
- [ ] **Step 1: Add architecture to all 8 agents**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit** — `"feat: add architecture data to Domain 16 agents (8 agents)"`

### Task 12: Domain 17 — Supplier Performance (7 agents)
**Reference:** Spec sections P7-01 through P7-07.
- [ ] **Step 1: Add architecture to all 7 agents**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit** — `"feat: add architecture data to Domain 17 agents (7 agents)"`

### Task 13: Domain 18 — Indirect & Tail Spend (6 agents)
**Reference:** Spec sections P8-01 through P8-06.
- [ ] **Step 1: Add architecture to all 6 agents**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit** — `"feat: add architecture data to Domain 18 agents (6 agents)"`

### Task 14: Domain 19 — Spend Analytics (10 agents)
**Reference:** Spec sections P9-01 through P9-10.
- [ ] **Step 1: Add architecture to all 10 agents**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit** — `"feat: add architecture data to Domain 19 agents (10 agents)"`

---

## Parallelization Guide

```
Task 1 (types) → Task 2 (HubSpokeMap) ─┐
                  Task 3 (Pipeline)    ──┤→ Task 4 (rewrite UseCaseSlide) → Task 5 (pilot)
                                         │
                                         └→ Tasks 6-14 (all parallel after Task 5 validates)
```

- **Tasks 1-5** are sequential — each depends on the previous
- **Tasks 6-14** can run in parallel — each domain's agents are independent files
