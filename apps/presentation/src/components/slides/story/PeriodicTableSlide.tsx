import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { normalizeAgentId } from "@ge/agent-resolver";
import { useSlideNavigation } from "../../../context/SlideContext";
import { AGENTS, AgentElement, TRIGGER_CONFIG } from "../../../constants/agents";
import { DOMAINS } from "../../../constants/domains";
import { useDepartment } from "../../../context/DepartmentContext";
import { DepartmentSwitcher } from "../../shared/DepartmentSwitcher";
import { LAYER_STYLES, TRIGGER_ICONS, TRIGGER_STYLES } from "../../../design-tokens";

// ─── Element Cell ──────────────────────────────────────────

const ElementCell = ({
  agent,
  domainColor,
  onClick,
  index,
  onHover,
}: {
  key?: React.Key;
  agent: AgentElement;
  domainColor: string;
  onClick: () => void;
  index: number;
  onHover: (agent: AgentElement | null) => void;
}) => {
  const TriggerIcon = TRIGGER_ICONS[agent.triggerType];
  const layerInfo = LAYER_STYLES[agent.layer];
  const num = normalizeAgentId(agent.agentId).num;

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.005, duration: 0.2 }}
      onClick={onClick}
      onMouseEnter={() => onHover(agent)}
      onMouseLeave={() => onHover(null)}
      className="group editorial-micro-card relative flex flex-col items-start justify-between gap-1.5 min-h-[72px] p-2.5 rounded-xl text-left hover:z-10 hover:-translate-y-0.5 hover:shadow-ambient transition-all duration-200 cursor-pointer"
      style={{
        borderTopColor: domainColor,
        borderTopWidth: 3,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    >
      {/* Top row: number + trigger */}
      <div className="flex items-center justify-between w-full">
        <span className="text-[8px] font-mono font-semibold text-secondary/45 leading-none">{num}</span>
        <TriggerIcon className={`w-2.5 h-2.5 ${TRIGGER_STYLES[agent.triggerType].color} opacity-55 group-hover:opacity-100 transition-opacity`} />
      </div>

      {/* Name */}
      <span className="text-[10.5px] font-headline font-bold leading-[1.2] group-hover:text-primary transition-colors line-clamp-2">
        {agent.shortName}
      </span>

      {/* Bottom row: layer + HITL */}
      <div className="flex items-center gap-1.5 w-full">
        <div className={`w-1.5 h-1.5 rounded-full ${layerInfo.dot} opacity-80`} />
        {agent.hitl && <ShieldCheck className="w-2.5 h-2.5 text-rose-400 opacity-70 group-hover:opacity-100 ml-auto" />}
      </div>
    </motion.button>
  );
};

// ─── Domain Group Header ───────────────────────────────────

const DomainGroupHeader = ({
  domain,
  agentCount,
  onClick,
}: {
  domain: typeof DOMAINS[0];
  agentCount: number;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="col-span-full flex items-center gap-1.5 py-0.5 group cursor-pointer"
  >
    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: domain.color }} />
    <span className="text-[8px] font-headline font-bold text-secondary/50 group-hover:text-primary transition-colors uppercase tracking-[0.08em]">
      {domain.title}
    </span>
    <span className="text-[7px] text-secondary/25 font-mono">{agentCount}</span>
    <ChevronRight className="w-2 h-2 text-secondary/15 group-hover:text-primary transition-colors" />
  </button>
);

// ─── Hover Detail Panel ────────────────────────────────────

const HoverDetail = ({ agent }: { key?: React.Key; agent: AgentElement }) => {
  const layerInfo = LAYER_STYLES[agent.layer];
  const TriggerIcon = TRIGGER_ICONS[agent.triggerType];
  const domainIdx = agent.domain - 1;
  const domain = DOMAINS[domainIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className="editorial-card p-3 rounded-lg"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: domain?.color }}>
          <span className="text-[8px] font-bold text-white font-mono">{normalizeAgentId(agent.agentId).num}</span>
        </div>
        <div>
          <div className="text-[11px] font-headline font-bold leading-tight">{agent.shortName}</div>
          <div className="text-[8px] text-secondary/50 font-mono">{agent.agentId} • {domain?.title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[7px] font-bold ${layerInfo.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${layerInfo.dot}`} />
          {layerInfo.label}
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-[7px] font-bold text-secondary/60">
          <TriggerIcon className={`w-2.5 h-2.5 ${TRIGGER_STYLES[agent.triggerType].color}`} />
          {TRIGGER_CONFIG[agent.triggerType].label}
        </div>
        {agent.hitl && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 text-[7px] font-bold text-rose-600">
            <ShieldCheck className="w-2.5 h-2.5" />
            {agent.hitlActor}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────

export const PeriodicTableSlide = () => {
  const { goToSlide } = useSlideNavigation();
  const { department: activeDept, config, allDepartments, setDepartment } = useDepartment();
  const [hoveredAgent, setHoveredAgent] = useState<AgentElement | null>(null);

  const [minDomain, maxDomain] = config.domainRange;

  const filteredDomains = DOMAINS.filter((_, idx) => {
    const domainNum = idx + 1;
    return domainNum >= minDomain && domainNum <= maxDomain;
  });

  const filteredAgents = AGENTS.filter(
    (a) => a.domain >= minDomain && a.domain <= maxDomain
  );

  const agentsByDomain = filteredDomains.map((domain) => {
    const domainIdx = DOMAINS.indexOf(domain);
    return {
      domain,
      agents: AGENTS.filter((a) => a.domain === domainIdx + 1),
    };
  });

  const totalAgents = filteredAgents.length;
  const hitlCount = filteredAgents.filter((a) => a.hitl).length;
  const triggerCounts = {
    event: filteredAgents.filter((a) => a.triggerType === "event").length,
    chat: filteredAgents.filter((a) => a.triggerType === "chat").length,
    scheduled: filteredAgents.filter((a) => a.triggerType === "scheduled").length,
  };

  let globalIndex = 0;

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Mobile: Department selector as hero tabs */}
      <div className="sm:hidden mb-2 shrink-0">
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {allDepartments.map((dept) => {
            const Icon = dept.icon;
            const isActive = activeDept === dept.key;
            const deptAgents = AGENTS.filter(a => a.domain >= dept.domainRange[0] && a.domain <= dept.domainRange[1]).length;
            return (
              <button
                key={dept.key}
                onClick={() => setDepartment(dept.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded shrink-0 transition-all duration-200 ${
                  isActive
                    ? `${dept.activeBg} text-white shadow-ambient`
                    : "bg-surface-container-low text-secondary/50 active:bg-surface-container-high"
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-[10px] font-headline font-bold leading-none">{dept.shortLabel}</div>
                  <div className={`text-[8px] mt-0.5 ${isActive ? "text-white/60" : "text-secondary/30"}`}>{deptAgents} agents</div>
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
              key={activeDept}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="text-lg sm:text-xl font-headline font-bold tracking-display shrink-0"
            >
              {config.periodicTableTitle}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeDept + "-sub"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[10px] text-secondary/50 hidden md:block truncate"
            >
              {config.periodicTableSubtitle}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2">
            <div className="editorial-micro-card px-2 py-1 rounded">
              <span className="text-[9px] font-bold text-primary">{totalAgents}</span>
              <span className="text-[8px] text-secondary/50 ml-1">agents</span>
            </div>
            <div className="editorial-micro-card px-2 py-1 rounded">
              <ShieldCheck className="w-2.5 h-2.5 text-rose-500 inline mr-1" />
              <span className="text-[9px] font-bold text-secondary/60">{hitlCount}</span>
            </div>
          </div>
          <DepartmentSwitcher />
        </div>
      </div>

      {/* Main content — table + hover panel */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0">
        {/* Table Grid — grouped by domain */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDept}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto overflow-x-hidden pr-1 space-y-0.5"
          >
            {agentsByDomain.map(({ domain, agents }) => (
              <div key={domain.id}>
                <DomainGroupHeader
                  domain={domain}
                  agentCount={agents.length}
                  onClick={() => goToSlide(domain.id)}
                />
                <div
                  className="grid gap-1.5 mb-2"
                  style={{ gridTemplateColumns: `repeat(${agents.length}, minmax(0, 1fr))` }}
                >
                  {agents.map((agent) => {
                    const idx = globalIndex++;
                    return (
                      <ElementCell
                        key={agent.id}
                        agent={agent}
                        domainColor={domain.color}
                        onClick={() => goToSlide(agent.id)}
                        index={idx}
                        onHover={setHoveredAgent}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Hover Detail Sidebar */}
        <div className="w-full lg:w-56 shrink-0 flex flex-col gap-2">
          {/* Hover info */}
          <div className="flex-1 flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              {hoveredAgent ? (
                <HoverDetail key={hoveredAgent.id} agent={hoveredAgent} />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full flex flex-col items-center justify-center gap-3 editorial-card editorial-card-muted rounded-lg border-dashed text-center p-5"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary/40" />
                  </div>
                  <span className="text-[10px] text-secondary/45 font-headline leading-relaxed">Hover an element to preview its blueprint.</span>
                  <span className="text-[8px] text-secondary/30 font-headline uppercase tracking-widest">Click to drill in</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Legend — vertical in sidebar */}
          <div className="editorial-card editorial-card-muted p-3 rounded-lg flex flex-row lg:flex-col gap-3">
            {/* Layers */}
            <div>
              <div className="text-[8px] font-bold uppercase tracking-widest text-secondary/40 mb-1.5">Layers</div>
              <div className="space-y-1">
                {Object.entries(LAYER_STYLES).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${val.dot}`} />
                    <span className="text-[8px] text-secondary/60">{val.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Triggers */}
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

            {/* Domains */}
            <div>
              <div className="text-[8px] font-bold uppercase tracking-widest text-secondary/40 mb-1.5">Domains</div>
              <div className="space-y-0.5">
                {filteredDomains.map((d) => {
                  const count = AGENTS.filter(a => a.domain === DOMAINS.indexOf(d) + 1).length;
                  return (
                    <button
                      key={d.id}
                      onClick={() => goToSlide(d.id)}
                      className="flex items-center gap-1.5 w-full hover:bg-surface-container px-1 py-0.5 rounded transition-colors"
                    >
                      <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-[7px] text-secondary/60 hover:text-primary truncate">{d.title}</span>
                      <span className="text-[7px] text-secondary/25 ml-auto shrink-0">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
