import React from "react";
import { motion } from "motion/react";
import { User, Cpu, Settings, LucideIcon } from "lucide-react";
import { LANE_STYLES, NODE_STYLES } from "../../design-tokens";

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

const LANE_ICONS = { human: User, agent: Cpu, system: Settings };

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
          const LaneIcon = LANE_ICONS[lane];
          const nodes = nodesByLane[lane];

          return (
            <div key={lane} className={`flex items-stretch ${config.bg} ${laneIdx < 2 ? `border-b ${config.border}` : ""}`}>
              {/* Lane Label */}
              <div className={`w-16 sm:w-24 shrink-0 flex flex-col items-center justify-center gap-1 p-2 border-r ${config.border}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.labelBg}`}>
                  <LaneIcon className="w-4 h-4" />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-center leading-tight opacity-70">{config.label}</span>
              </div>

              {/* Nodes in this lane */}
              <div className="flex-1 flex items-center gap-2 sm:gap-3 p-2 sm:p-3 min-h-[48px] sm:min-h-[64px]">
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
                        >{"\u2192"}</motion.span>
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
