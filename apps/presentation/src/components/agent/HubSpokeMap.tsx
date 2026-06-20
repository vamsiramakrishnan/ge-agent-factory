import React from "react";
import { motion } from "motion/react";
import {
  Database,
  BarChart3,
  Brain,
  FileSignature,
  TrendingUp,
  MessageSquare,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Cpu,
} from "lucide-react";
import { SystemConnection, SystemCategory, ConnectionDirection } from "../../types/architecture";
import { CATEGORY_STYLES } from "../../design-tokens";

const CATEGORY_ICONS: Record<SystemCategory, React.ElementType> = {
  erp: Database,
  analytics: BarChart3,
  ai: Brain,
  clm: FileSignature,
  "market-data": TrendingUp,
  collaboration: MessageSquare,
};

const FALLBACK_CATEGORY_STYLE = CATEGORY_STYLES.collaboration;
const FALLBACK_CATEGORY_ICON = MessageSquare;

const DIRECTION_LABELS: Record<ConnectionDirection, string> = {
  read: "reads",
  write: "writes",
  bidirectional: "read/write",
};

const DIRECTION_ICONS: Record<ConnectionDirection, React.ElementType> = {
  read: ArrowDownLeft,
  write: ArrowUpRight,
  bidirectional: ArrowLeftRight,
};

interface HubSpokeMapProps {
  connections: SystemConnection[];
  agentLabel?: string;
}

export const HubSpokeMap: React.FC<HubSpokeMapProps> = ({
  connections,
  agentLabel = "Agent",
}) => {
  // Split connections into left and right columns for a clean table layout
  const mid = Math.ceil(connections.length / 2);
  const leftConns = connections.slice(0, mid);
  const rightConns = connections.slice(mid);

  const ConnectionRow = ({ conn, index, side }: { key?: React.Key; conn: SystemConnection; index: number; side: "left" | "right" }) => {
    const catStyle = CATEGORY_STYLES[conn.category] || FALLBACK_CATEGORY_STYLE;
    const CatIcon = CATEGORY_ICONS[conn.category] || FALLBACK_CATEGORY_ICON;
    const DirIcon = DIRECTION_ICONS[conn.direction] || ArrowLeftRight;

    return (
      <motion.div
        initial={{ opacity: 0, x: side === "left" ? -8 : 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, delay: index * 0.06 }}
        className="flex items-start gap-2 p-2 rounded bg-surface-container-lowest hover:bg-surface-bright transition-all duration-200 shadow-ambient"
      >
        <div
          className="w-7 h-7 rounded flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${catStyle.color}12` }}
        >
          <CatIcon className="w-3.5 h-3.5" style={{ color: catStyle.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[8px] font-headline font-bold text-on-surface/80 leading-tight truncate">{conn.system}</div>
          <div className="text-[7px] text-secondary/40 leading-tight mt-0.5 line-clamp-1">{conn.description}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              <DirIcon className="w-2.5 h-2.5" style={{ color: catStyle.color }} />
              <span className="text-[6px] font-bold uppercase" style={{ color: catStyle.color }}>{DIRECTION_LABELS[conn.direction]}</span>
            </div>
            {conn.protocol && (
              <span className="text-[5px] font-mono px-1 py-px rounded bg-surface-container text-secondary/30">
                {conn.protocol}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-2 min-h-[190px] h-full">
      {/* Hub at top */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center"
      >
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 shadow-md shadow-violet-500/20">
          <Cpu className="w-4 h-4 text-white" />
          <div>
            <div className="text-[8px] font-bold text-white/90 uppercase tracking-wider">{agentLabel}</div>
            <div className="text-[6px] text-white/50 font-mono">Hub Agent</div>
          </div>
        </div>
      </motion.div>

      {/* Connections grid — two columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 flex-1">
        <div className="flex flex-col gap-1.5">
          {leftConns.map((conn, i) => (
            <ConnectionRow key={i} conn={conn} index={i} side="left" />
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          {rightConns.map((conn, i) => (
            <ConnectionRow key={i} conn={conn} index={i + mid} side="right" />
          ))}
        </div>
      </div>
    </div>
  );
};
