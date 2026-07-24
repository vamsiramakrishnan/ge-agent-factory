import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Layers3 } from "lucide-react";
import { TRIGGER_CONFIG } from "../../../constants/agents";
import { TRIGGER_ICONS, TRIGGER_STYLES } from "../../../design-tokens";
import { useSlideNavigation } from "../../../context/SlideContext";
import { useVertical } from "../../../context/VerticalContext";
import { VerticalSwitcher } from "../../shared/VerticalSwitcher";
import type { VerticalAgent, ValueStream } from "../../../verticals";

// ─── Element Cell ──────────────────────────────────────────

const ElementCell = ({
  agent,
  streamColor,
  index,
  onHover,
  onClick,
}: {
  key?: React.Key;
  agent: VerticalAgent;
  streamColor: string;
  index: number;
  onHover: (agent: VerticalAgent | null) => void;
  onClick: () => void;
}) => {
  const TriggerIcon = TRIGGER_ICONS[agent.triggerType];
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.008, duration: 0.22 }}
      onClick={onClick}
      onMouseEnter={() => onHover(agent)}
      onMouseLeave={() => onHover(null)}
      className="group editorial-micro-card relative flex flex-col items-start justify-between gap-1.5 min-h-[76px] p-2.5 rounded-xl text-left hover:z-10 hover:-translate-y-0.5 hover:shadow-ambient transition-all duration-200 cursor-pointer"
      style={{
        borderTopColor: streamColor,
        borderTopWidth: 3,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    >
      {/* Top row: code + trigger */}
      <div className="flex items-center justify-between w-full">
        <span className="text-[8px] font-mono font-semibold text-secondary/45 leading-none">{agent.valueStreamCode}</span>
        <TriggerIcon className={`w-2.5 h-2.5 ${TRIGGER_STYLES[agent.triggerType].color} opacity-55 group-hover:opacity-100 transition-opacity`} />
      </div>

      {/* Name */}
      <span className="text-[10.5px] font-headline font-bold leading-[1.2] group-hover:text-primary transition-colors line-clamp-2">
        {agent.title}
      </span>
    </motion.button>
  );
};

// ─── Value Stream Group Header ─────────────────────────────

const StreamGroupHeader = ({ stream }: { stream: ValueStream }) => (
  <div className="col-span-full flex items-center gap-1.5 py-0.5">
    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: stream.color }} />
    <span className="text-[8px] font-headline font-bold text-secondary/50 uppercase tracking-[0.08em]">
      {stream.name}
    </span>
    <span className="text-[7px] text-secondary/25 font-mono">{stream.code}</span>
    <span className="text-[7px] text-secondary/25 font-mono ml-auto">{stream.agents.length}</span>
  </div>
);

// ─── Detail Panel ──────────────────────────────────────────

const AgentDetail = ({ agent, streamColor }: { key?: React.Key; agent: VerticalAgent; streamColor: string }) => {
  const TriggerIcon = TRIGGER_ICONS[agent.triggerType];
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className="editorial-card p-3 rounded-lg overflow-y-auto flex-1 min-h-0"
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: streamColor }} />
        <div className="min-w-0">
          <div className="text-[11px] font-headline font-bold leading-tight">{agent.title}</div>
          <div className="text-[8px] text-secondary/50 font-mono mt-0.5">{agent.valueStreamCode}</div>
        </div>
      </div>

      {/* Persona + trigger */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-[7px] font-bold text-secondary/70">
          {agent.persona}
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-[7px] font-bold text-secondary/60">
          <TriggerIcon className={`w-2.5 h-2.5 ${TRIGGER_STYLES[agent.triggerType].color}`} />
          {TRIGGER_CONFIG[agent.triggerType].label}
        </div>
      </div>

      {/* Systems */}
      <div className="flex flex-wrap gap-1 mb-2.5">
        {agent.systems.map((s) => (
          <span key={s} className="px-1.5 py-0.5 rounded bg-primary/5 text-[7px] font-mono text-secondary/60">{s}</span>
        ))}
      </div>

      {/* KPIs */}
      <div className="mb-2.5">
        <div className="text-[8px] font-bold uppercase tracking-widest text-secondary/40 mb-1">Impact</div>
        <div className="space-y-1">
          {agent.kpis.map((k) => (
            <div key={k.label} className="text-[8px]">
              <div className="text-secondary/60 leading-tight">{k.label}</div>
              <div className="flex items-center gap-1 font-bold">
                <span className="text-rose-500/80 line-through decoration-rose-400/40">{k.before}</span>
                <ArrowRight className="w-2.5 h-2.5 text-secondary/30" />
                <span className="text-emerald-600">{k.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status quo */}
      <div className="mb-2.5">
        <div className="text-[8px] font-bold uppercase tracking-widest text-secondary/40 mb-1">Today</div>
        <ul className="space-y-1">
          {agent.statusQuo.map((s, i) => (
            <li key={i} className="text-[8px] text-secondary/60 leading-snug pl-2 relative before:content-['–'] before:absolute before:left-0 before:text-secondary/30">
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Agentification */}
      <div>
        <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-primary/70 mb-1">
          <Sparkles className="w-2.5 h-2.5" /> With the agent
        </div>
        <ul className="space-y-1">
          {agent.agentification.map((s, i) => (
            <li key={i} className="text-[8px] text-secondary/70 leading-snug pl-2 relative before:content-['→'] before:absolute before:left-0 before:text-primary/50">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────

export const VerticalTableSlide = () => {
  const { goToSlide } = useSlideNavigation();
  const { vertical: activeKey, config, allVerticals, setVertical } = useVertical();
  const [hovered, setHovered] = useState<VerticalAgent | null>(null);

  // The desktop sidebar is a lightweight hover *preview*. Clicking a cell drills
  // into the agent's dedicated full-screen detail slide (goToSlide) — exactly how
  // the horizontal periodic table behaves — rather than opening a modal.
  const shown = hovered;
  const shownStreamColor = useMemo(() => {
    if (!shown) return config.accentColor;
    return config.valueStreams.find((vs) => vs.code === shown.valueStreamCode)?.color ?? config.accentColor;
  }, [shown, config]);

  const triggerCounts = useMemo(() => {
    const all = config.valueStreams.flatMap((vs) => vs.agents);
    return {
      event: all.filter((a) => a.triggerType === "event").length,
      chat: all.filter((a) => a.triggerType === "chat").length,
      scheduled: all.filter((a) => a.triggerType === "scheduled").length,
    };
  }, [config]);

  let globalIndex = 0;

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Mobile: industry selector as hero tabs */}
      <div className="sm:hidden mb-2 shrink-0">
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {allVerticals.map((v) => {
            const Icon = v.icon;
            const isActive = activeKey === v.key;
            return (
              <button
                key={v.key}
                onClick={() => setVertical(v.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded shrink-0 transition-all duration-200 ${
                  isActive
                    ? `${v.activeBg} text-white shadow-ambient`
                    : "bg-surface-container-low text-secondary/50 active:bg-surface-container-high"
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-[10px] font-headline font-bold leading-none">{v.shortLabel}</div>
                  <div className={`text-[8px] mt-0.5 ${isActive ? "text-white/60" : "text-secondary/30"}`}>{v.agentCount} agents</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: inline header with title + switcher */}
      <div className="hidden sm:flex mb-1 items-center justify-between shrink-0">
        <div className="min-w-0 flex items-baseline gap-3">
          <AnimatePresence mode="wait">
            <motion.h2
              key={activeKey}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="text-lg sm:text-xl font-headline font-bold tracking-display shrink-0"
            >
              {config.label} — Industry Agents
            </motion.h2>
          </AnimatePresence>
          <p className="text-[10px] text-secondary/50 hidden md:block truncate">
            {config.streamCount} value streams • {config.agentCount} vertical agents
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2">
            <div className="editorial-micro-card px-2 py-1 rounded">
              <Layers3 className="w-2.5 h-2.5 text-primary inline mr-1" />
              <span className="text-[9px] font-bold text-primary">{config.agentCount}</span>
              <span className="text-[8px] text-secondary/50 ml-1">agents</span>
            </div>
          </div>
          <VerticalSwitcher />
        </div>
      </div>

      {/* Main content — table + detail panel */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto overflow-x-hidden pr-1 space-y-0.5"
          >
            {config.valueStreams.map((stream) => (
              <div key={stream.code}>
                <StreamGroupHeader stream={stream} />
                <div
                  className="grid gap-1.5 mb-2"
                  style={{ gridTemplateColumns: `repeat(${stream.agents.length}, minmax(0, 1fr))` }}
                >
                  {stream.agents.map((agent) => {
                    const idx = globalIndex++;
                    return (
                      <ElementCell
                        key={agent.id}
                        agent={agent}
                        streamColor={stream.color}
                        index={idx}
                        onHover={setHovered}
                        onClick={() => goToSlide(agent.id)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Detail Sidebar — desktop only; mobile uses the bottom sheet below */}
        <div className="hidden lg:flex w-72 shrink-0 flex-col gap-2 min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              {shown ? (
                <AgentDetail key={shown.id} agent={shown} streamColor={shownStreamColor} />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center gap-3 editorial-card editorial-card-muted rounded-lg border-dashed text-center p-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                    <Layers3 className="w-5 h-5 text-primary/50" />
                  </div>
                  <span className="text-[10px] text-secondary/50 font-headline leading-relaxed block max-w-[200px]">
                    Industry-native agents for {config.label.toLowerCase()} — the ones that only exist because you run this business.
                  </span>
                  <span className="text-[8px] text-secondary/35 font-headline uppercase tracking-widest">Hover to preview · click to open</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Legend — triggers + value streams */}
          <div className="editorial-card editorial-card-muted p-3 rounded-lg flex flex-row lg:flex-col gap-3 shrink-0">
            <div>
              <div className="text-[8px] font-bold uppercase tracking-widest text-secondary/40 mb-1.5">Triggers</div>
              <div className="space-y-1">
                {(Object.entries(TRIGGER_CONFIG) as [string, typeof TRIGGER_CONFIG[keyof typeof TRIGGER_CONFIG]][]).map(
                  ([key, cfg]) => {
                    const Icon = TRIGGER_ICONS[key as keyof typeof TRIGGER_ICONS];
                    return (
                      <div key={key} className="flex items-center gap-1.5">
                        <Icon className={`w-2.5 h-2.5 ${TRIGGER_STYLES[key as keyof typeof TRIGGER_STYLES].color}`} />
                        <span className="text-[8px] text-secondary/60">{cfg.label}</span>
                        <span className="text-[7px] text-secondary/30 ml-auto">{triggerCounts[key as keyof typeof triggerCounts]}</span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <div>
              <div className="text-[8px] font-bold uppercase tracking-widest text-secondary/40 mb-1.5">Value Streams</div>
              <div className="space-y-0.5">
                {config.valueStreams.map((vs) => (
                  <div key={vs.code} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: vs.color }} />
                    <span className="text-[7px] text-secondary/60 truncate">{vs.name}</span>
                    <span className="text-[7px] text-secondary/25 ml-auto shrink-0">{vs.agents.length}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
