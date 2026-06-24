import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Zap, Search, Settings, CheckCircle, Cpu, Layers, User, ChevronRight } from "lucide-react";
import { useSlideNavigation } from "../../context/SlideContext";

import { useUsecaseId } from "../../context/UsecaseIdContext";
import { FlowStep } from "./ProcessFlow";
import { SwimlaneFlowComponent, SwimlaneFlow } from "./SwimlaneFlow";
import { TriggerType, AGENTS } from "../../constants/agents";
import { AgentArchitecture, KPI, HITLConfig, UseCaseGenerationSpec } from "../../types/architecture";
import { HubSpokeMap } from "./HubSpokeMap";
import { DataFlowPipeline } from "./DataFlowPipeline";
import { LAYER_STYLES, TRIGGER_STYLES, TRIGGER_ICONS, HITL_STYLES } from "../../design-tokens";
import { FactoryProvisionPanel } from "./FactoryProvisionPanel";

export type AgentLayer =
  | "Layer 1: OOTB"
  | "Layer 2: Agent Designer"
  | "Layer 2: ML & Analytics"
  | "Layer 3: Custom ADK"
  | "Layer 4: Data Agent"
  | "Layer 4: Full Orchestration";

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
  generationSpec?: UseCaseGenerationSpec;
}

const LAYER_KEY_MAP: Record<AgentLayer, number> = {
  "Layer 1: OOTB": 1,
  "Layer 2: Agent Designer": 2,
  "Layer 2: ML & Analytics": 2,
  "Layer 3: Custom ADK": 3,
  "Layer 4: Data Agent": 4,
  "Layer 4: Full Orchestration": 4,
};

const DEFAULT_FLOW: FlowStep[] = [
  { label: "Trigger", icon: Zap, description: "Event or request initiates workflow.", trigger: "Event-driven", systems: ["HRIS", "Slack"] },
  { label: "Analysis", icon: Search, description: "Agent reasons over context and data.", systems: ["Gemini"], integration: "Native API" },
  { label: "Action", icon: Settings, description: "Orchestrates across systems.", systems: ["ERP", "LMS"], output: "System Update" },
  { label: "Outcome", icon: CheckCircle, description: "Completed with audit trail.", output: "Audit Log" },
];

const departmentFromDomainId = (domainId?: string) => {
  const id = Number(domainId?.replace("domain-", ""));
  if (!Number.isFinite(id)) return undefined;
  if (id <= 10) return "hr";
  if (id <= 19) return "procurement";
  if (id <= 28) return "finance";
  if (id <= 37) return "marketing";
  return "it";
};

const SectionLabel = ({ children }: { children: string }) => (
  <div className="flex items-center gap-2.5 shrink-0 mt-1.5">
    <span className="inline-block w-1.5 h-1.5 rounded-[2px] hero-gradient shrink-0" />
    <span className="text-[9px] font-headline font-bold uppercase tracking-[0.14em] text-secondary/75">{children}</span>
    <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/35 to-transparent" />
  </div>
);

export const UseCaseSlide = ({
  title, subtitle, statusQuo, agentification, icon: Icon, domainId,
  flow = DEFAULT_FLOW, layer, persona, systems, kpis, triggerType, hitl, swimlane, architecture, generationSpec,
}: UseCaseSlideProps) => {
  const { goToSlide, nextSlide, prevSlide } = useSlideNavigation();
  const usecaseId = useUsecaseId();
  const layerKey = layer ? LAYER_KEY_MAP[layer] : null;
  const layerInfo = layerKey ? LAYER_STYLES[layerKey] : null;
  const triggerInfo = triggerType ? TRIGGER_STYLES[triggerType] : null;
  const TriggerIcon = triggerType ? TRIGGER_ICONS[triggerType] : null;
  const connectedSystems = systems ?? architecture?.connections?.map((item) => item.system).filter(Boolean) ?? [];
  const factoryDepartment = departmentFromDomainId(domainId);
  const resolvedArchitecture = React.useMemo(() => {
    const hasArchitecture = (architecture?.connections?.length || 0) > 0 || (architecture?.pipeline?.length || 0) > 0;
    if (hasArchitecture) {
      return {
        connections: architecture?.connections || [],
        pipeline: architecture?.pipeline || [],
      };
    }
    if (connectedSystems.length === 0) return null;
    return {
      connections: connectedSystems.map((system) => ({
        system,
        description: `${system} source-system context for ${title}.`,
        direction: "read" as const,
        protocol: "API / connector",
        category: "erp" as const,
      })),
      pipeline: [
        {
          label: "Source Context",
          description: "Collect records, documents, and operational state from connected source systems.",
          systems: connectedSystems,
          layer: "integration" as const,
          dataIn: "User request",
          dataOut: "Grounded source context",
        },
        {
          label: "Agent Reasoning",
          description: "Gemini evaluates the workflow, cites evidence, and determines the next best action.",
          systems: ["Gemini"],
          layer: "llm" as const,
          dataIn: "Source context",
          dataOut: "Decision and response",
        },
      ],
    };
  }, [architecture, connectedSystems, title]);

  return (
    <div className="use-case-detail flex-1 flex flex-col h-full overflow-y-auto space-y-3">
      {/* ═══ HEADER ═══ */}
      <div className="flex items-start justify-between shrink-0">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl hero-gradient flex items-center justify-center shadow-ambient shrink-0 agent-glow">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-headline font-bold leading-tight truncate tracking-tight">{title}</h2>
            <p className="text-secondary/70 text-[9px] uppercase tracking-[0.18em] font-mono mt-1">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end max-w-full sm:max-w-[55%]">
          {triggerInfo && TriggerIcon && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded text-[8px] font-headline font-bold uppercase tracking-[0.06em] ${triggerInfo.bg} ${triggerInfo.color}`}>
              <TriggerIcon className="w-2.5 h-2.5" />
              {triggerInfo.label}
            </div>
          )}
          {layerInfo && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded text-[8px] font-headline font-bold uppercase tracking-[0.06em] ${layerInfo.bg} ${layerInfo.color}`}>
              <Layers className="w-2.5 h-2.5" />
              {layerInfo.label}
            </div>
          )}
          {hitl && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded text-[8px] font-headline font-bold uppercase tracking-[0.06em] ${HITL_STYLES.badge}`}>
              <User className="w-2.5 h-2.5" />
              HITL
            </div>
          )}
          {persona && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container text-[8px] font-headline font-bold uppercase tracking-[0.06em] text-secondary/50">
              {persona}
            </div>
          )}
          {domainId && (
            <button onClick={() => goToSlide(domainId)} className="flex items-center gap-1 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-[0.06em] text-secondary/55 hover:text-primary hover:bg-surface-container-high transition-colors">
              <ArrowLeft className="w-2.5 h-2.5" />Back
            </button>
          )}
          <div className="flex gap-0.5 ml-1">
            <button onClick={prevSlide} aria-label="Previous" className="p-1 rounded hover:bg-surface-container-high transition-colors"><ArrowLeft className="w-3 h-3 text-secondary/55" /></button>
            <button onClick={nextSlide} aria-label="Next" className="p-1 rounded hover:bg-surface-container-high transition-colors"><ArrowRight className="w-3 h-3 text-secondary/55" /></button>
          </div>
        </div>
      </div>

      {/* Hairline divider grounds the header over the dense body below. */}
      <div className="h-px shrink-0 bg-gradient-to-r from-outline-variant/45 via-outline-variant/20 to-transparent" />

      <FactoryProvisionPanel title={title} department={factoryDepartment} systems={connectedSystems} generationSpec={generationSpec} usecaseId={usecaseId} />

      {/* ═══ STATUS QUO vs AGENT ═══ */}
      <SectionLabel>Status Quo vs. Agent</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
        {/* Before — tonal surface shift, no border */}
        <div className="editorial-card editorial-card-muted p-4 rounded-lg">
          <div className="flex items-center gap-1.5 mb-3">
            <AlertCircle className="w-3 h-3 text-secondary/40" />
            <span className="font-headline font-bold uppercase tracking-[0.1em] text-[8px] text-secondary/40">Today — Manual</span>
          </div>
          <ul className="space-y-2">
            {statusQuo.map((item, i) => (
              <li key={i} className="flex gap-2 text-secondary text-[10px] leading-relaxed">
                <div className="editorial-micro-card w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[6px] font-mono font-bold text-secondary/40">{String(i + 1).padStart(2, "0")}</span>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* After — subtle primary tint, no explicit border */}
        <div className="editorial-card editorial-card-tint p-4 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/[0.09] via-primary/[0.03] to-transparent translate-x-1/3 -translate-y-1/3" />
          <div className="flex items-center gap-1.5 mb-3 text-primary">
            <Cpu className="w-3 h-3" />
            <span className="font-headline font-bold uppercase tracking-[0.1em] text-[8px]">With Agent — Autonomous</span>
          </div>
          <ul className="space-y-2 relative z-10">
            {agentification.map((item, i) => (
              <li key={i} className="flex gap-2 font-medium text-[10px] leading-relaxed text-on-surface">
                <div className="editorial-micro-card w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ═══ IMPACT METRICS ═══ */}
      {kpis && kpis.length > 0 && (
        <>
          <SectionLabel>Impact Metrics</SectionLabel>
          {/* Static column classes (Tailwind can't generate runtime-built ones). */}
          <div className={`grid grid-cols-2 gap-2.5 shrink-0 ${kpis.length >= 4 ? "sm:grid-cols-4" : kpis.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {kpis.map((kpi, i) => (
              <div key={i} className="editorial-card p-3 pt-3.5 rounded-lg text-center relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[2px] hero-gradient opacity-70" />
                <div className="text-[8px] font-headline font-bold uppercase tracking-[0.12em] text-secondary/55 mb-2">{kpi.label}</div>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-[10px] font-mono text-secondary/45 line-through decoration-1">{kpi.before}</span>
                  <ChevronRight className="w-3 h-3 text-primary/45 self-center shrink-0" />
                  <span className="text-base font-mono font-bold text-primary tracking-tight">{kpi.after}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ═══ AGENT WORKFLOW ═══ */}
      {swimlane && (
        <>
          <SectionLabel>Agent Workflow</SectionLabel>
          <div className="shrink-0">
            <SwimlaneFlowComponent flow={swimlane} triggerType={triggerType} hitl={hitl} />
          </div>
        </>
      )}

      {/* ═══ ARCHITECTURE ═══ */}
      {resolvedArchitecture && (
        <>
          <SectionLabel>Data Flow & System Architecture</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-3 shrink-0 items-stretch">
            <div className="editorial-card editorial-card-muted p-3 rounded-lg flex flex-col min-h-[240px]">
              <div className="text-[8px] font-headline font-bold uppercase tracking-[0.12em] text-secondary/30 mb-2.5 shrink-0">System Integration Map</div>
              <div className="flex-1 min-h-0"><HubSpokeMap connections={resolvedArchitecture.connections} agentLabel={title.length > 18 ? title.split(" ").slice(0, 2).join(" ") : title} /></div>
            </div>
            <div className="editorial-card editorial-card-muted p-3 rounded-lg flex flex-col min-h-[240px]">
              <div className="text-[8px] font-headline font-bold uppercase tracking-[0.12em] text-secondary/30 mb-2.5 shrink-0">Data Flow Pipeline</div>
              <div className="flex-1 min-h-0"><DataFlowPipeline stages={resolvedArchitecture.pipeline} /></div>
            </div>
          </div>
        </>
      )}

      {/* ═══ SYSTEMS & GOVERNANCE ═══ */}
      <SectionLabel>Systems & Governance</SectionLabel>
      <div className={`grid gap-3 shrink-0 ${hitl ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
        <div className="editorial-card editorial-card-muted p-3 rounded-lg">
          <div className="text-[8px] font-headline font-bold uppercase tracking-[0.12em] text-secondary/30 mb-2.5">Connected Systems</div>
          {connectedSystems.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {connectedSystems.map((sys, i) => (
                <div key={i} className="editorial-micro-card flex items-center gap-1.5 px-2.5 py-1 rounded">
                  <Settings className="w-2.5 h-2.5 text-primary/30" />
                  <span className="text-[9px] font-headline font-bold text-on-surface/70">{sys}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[9px] text-secondary/30">No system integrations specified</p>
          )}
        </div>

        {hitl && (
          <div className={`editorial-card flex items-start gap-3 p-3 rounded-lg ${HITL_STYLES.card}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${HITL_STYLES.avatar}`}>
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className={`font-headline font-bold text-[10px] ${HITL_STYLES.title}`}>Human-in-the-Loop: {hitl.actor}</div>
              <div className={`text-[9px] font-semibold mt-0.5 ${HITL_STYLES.action}`}>{hitl.action}</div>
              <div className={`text-[8px] mt-1 leading-snug ${HITL_STYLES.desc}`}>{hitl.description}</div>
            </div>
          </div>
        )}

        {!hitl && (
          <div className="editorial-card editorial-card-muted p-3 rounded-lg">
            <div className="text-[8px] font-headline font-bold uppercase tracking-[0.12em] text-secondary/30 mb-2.5">Governance</div>
            <div className="space-y-2">
              {layerInfo && (
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-secondary/50">Build</span>
                  <span className={`text-[9px] font-headline font-bold px-2 py-0.5 rounded ${layerInfo.bg} ${layerInfo.color}`}>{layerInfo.label}</span>
                </div>
              )}
              {triggerInfo && (
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-secondary/50">Trigger</span>
                  <span className={`text-[9px] font-headline font-bold px-2 py-0.5 rounded ${triggerInfo.bg} ${triggerInfo.color}`}>{triggerInfo.label}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-secondary/50">Human Oversight</span>
                <span className="text-[9px] font-headline font-bold text-secondary/30">Fully Autonomous</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
