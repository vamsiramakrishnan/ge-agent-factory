import React from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Cpu,
  ChevronRight,
  Settings,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSlideNavigation } from "../../context/SlideContext";
import { TRIGGER_STYLES, TRIGGER_ICONS } from "../../design-tokens";
import type { VerticalAgent } from "../../verticals";

// A leaf detail slide for a single industry-vertical agent. Deliberately mirrors
// the horizontal `UseCaseSlide` layout — header, Status Quo vs. Agent, Impact
// Metrics, Connected Systems — so drilling into a vertical agent feels identical
// to drilling into a horizontal use case. Vertical seeds carry less structure
// than horizontal specs (no swimlane / architecture graph), so those sections
// are simply omitted rather than faked.

export interface VerticalAgentSlideProps {
  agent: VerticalAgent;
  icon: LucideIcon;
  verticalLabel: string;
  streamName: string;
  streamColor: string;
}

const SectionLabel = ({ children }: { children: string }) => (
  <div className="flex items-center gap-2.5 shrink-0 mt-1.5">
    <span className="inline-block w-1.5 h-1.5 rounded-[2px] hero-gradient shrink-0" />
    <span className="text-[9px] font-headline font-bold uppercase tracking-[0.14em] text-secondary/75">{children}</span>
    <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/35 to-transparent" />
  </div>
);

export const VerticalAgentSlide = ({
  agent,
  icon: Icon,
  verticalLabel,
  streamName,
  streamColor,
}: VerticalAgentSlideProps) => {
  const { goToSlide, nextSlide, prevSlide } = useSlideNavigation();
  const triggerInfo = TRIGGER_STYLES[agent.triggerType];
  const TriggerIcon = TRIGGER_ICONS[agent.triggerType];

  return (
    <div className="use-case-detail flex-1 flex flex-col h-full overflow-y-auto space-y-3">
      {/* ═══ HEADER ═══ */}
      <div className="flex items-start justify-between shrink-0">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-ambient shrink-0 agent-glow"
            style={{ backgroundColor: streamColor }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-headline font-bold leading-tight truncate tracking-tight">{agent.title}</h2>
            <p className="text-secondary/70 text-[9px] uppercase tracking-[0.18em] font-mono mt-1">
              {verticalLabel} · {streamName} · {agent.valueStreamCode}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end max-w-full sm:max-w-[55%]">
          {triggerInfo && TriggerIcon && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded text-[8px] font-headline font-bold uppercase tracking-[0.06em] ${triggerInfo.bg} ${triggerInfo.color}`}>
              <TriggerIcon className="w-2.5 h-2.5" />
              {triggerInfo.label}
            </div>
          )}
          {agent.persona && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container text-[8px] font-headline font-bold uppercase tracking-[0.06em] text-secondary/50">
              {agent.persona}
            </div>
          )}
          <button
            onClick={() => goToSlide("vertical-map")}
            className="flex items-center gap-1 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-[0.06em] text-secondary/55 hover:text-primary hover:bg-surface-container-high transition-colors"
          >
            <ArrowLeft className="w-2.5 h-2.5" />
            Back
          </button>
          <div className="flex gap-0.5 ml-1">
            <button onClick={prevSlide} aria-label="Previous" className="p-1 rounded hover:bg-surface-container-high transition-colors"><ArrowLeft className="w-3 h-3 text-secondary/55" /></button>
            <button onClick={nextSlide} aria-label="Next" className="p-1 rounded hover:bg-surface-container-high transition-colors"><ArrowRight className="w-3 h-3 text-secondary/55" /></button>
          </div>
        </div>
      </div>

      {/* Hairline divider grounds the header over the dense body below. */}
      <div className="h-px shrink-0 bg-gradient-to-r from-outline-variant/45 via-outline-variant/20 to-transparent" />

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
            {agent.statusQuo.map((item, i) => (
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
            {agent.agentification.map((item, i) => (
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
      {agent.kpis && agent.kpis.length > 0 && (
        <>
          <SectionLabel>Impact Metrics</SectionLabel>
          {/* Static column classes (Tailwind can't generate runtime-built ones). */}
          <div className={`grid grid-cols-2 gap-2.5 shrink-0 ${agent.kpis.length >= 4 ? "sm:grid-cols-4" : agent.kpis.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {agent.kpis.map((kpi, i) => (
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

      {/* ═══ CONNECTED SYSTEMS ═══ */}
      <SectionLabel>Systems & Governance</SectionLabel>
      <div className="grid gap-3 shrink-0 grid-cols-1 sm:grid-cols-2">
        <div className="editorial-card editorial-card-muted p-3 rounded-lg">
          <div className="text-[8px] font-headline font-bold uppercase tracking-[0.12em] text-secondary/30 mb-2.5">Connected Systems</div>
          {agent.systems.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {agent.systems.map((sys, i) => (
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

        <div className="editorial-card editorial-card-muted p-3 rounded-lg">
          <div className="text-[8px] font-headline font-bold uppercase tracking-[0.12em] text-secondary/30 mb-2.5">Governance</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-secondary/50">Vertical</span>
              <span className="text-[9px] font-headline font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: streamColor }}>{verticalLabel}</span>
            </div>
            {triggerInfo && (
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-secondary/50">Trigger</span>
                <span className={`text-[9px] font-headline font-bold px-2 py-0.5 rounded ${triggerInfo.bg} ${triggerInfo.color}`}>{triggerInfo.label}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-secondary/50">Value Stream</span>
              <span className="text-[9px] font-headline font-bold text-secondary/40 truncate max-w-[60%] text-right">{streamName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* A restrained closing flourish so the slide echoes the vertical map's tone. */}
      <div className="flex items-center gap-1.5 shrink-0 pt-1 text-secondary/35">
        <Sparkles className="w-2.5 h-2.5" />
        <span className="text-[8px] font-headline uppercase tracking-[0.14em]">Industry-native agent · {verticalLabel}</span>
      </div>
    </div>
  );
};
