 /**
 * ═══════════════════════════════════════════════════════
 * Design Tokens — Google Cloud Console
 * ═══════════════════════════════════════════════════════
 *
 * Philosophy: white/off-white work surfaces, Google blue primary actions,
 * neutral greys for structure, and sparse semantic accents for state.
 */

import { Zap, MessageCircle, Clock } from "lucide-react";

// ─── Agent Layers ──────────────────────────────────────
// Strategic color pops against quiet Cloud Console surfaces.
export const LAYER_STYLES = {
  1: { label: "OOTB",           desc: "Ready to deploy", dot: "bg-emerald-500",  color: "text-emerald-600",  bg: "bg-emerald-500/10" },
  2: { label: "Agent Designer", desc: "No-code",         dot: "bg-blue-500",     color: "text-blue-600",     bg: "bg-blue-500/10" },
  3: { label: "Custom ADK",     desc: "Dev build",       dot: "bg-amber-500",    color: "text-amber-700",    bg: "bg-amber-500/10" },
  4: { label: "Data Agent",     desc: "Analytics",       dot: "bg-slate-500",    color: "text-slate-600",    bg: "bg-slate-500/10" },
} as const;

// ─── Trigger Types ─────────────────────────────────────
export const TRIGGER_ICONS = {
  event: Zap,
  chat: MessageCircle,
  scheduled: Clock,
} as const;

export const TRIGGER_STYLES = {
  event:     { color: "text-emerald-600", bg: "bg-emerald-500/10", label: "Event-Driven",   dot: "bg-emerald-500" },
  chat:      { color: "text-blue-600",    bg: "bg-blue-500/10",    label: "Chat-Initiated",  dot: "bg-blue-500" },
  scheduled: { color: "text-amber-600",   bg: "bg-amber-500/10",   label: "Scheduled",       dot: "bg-amber-500" },
} as const;

// ─── HITL ──────────────────────────────────────────────
export const HITL_STYLES = {
  badge: "bg-rose-500/10 text-rose-600",
  card: "bg-rose-500/[0.04]",
  avatar: "bg-rose-500/15 text-rose-600",
  title: "text-rose-700",
  action: "text-rose-600",
  desc: "text-rose-500/70",
} as const;

// ─── System Categories (Architecture) ──────────────────
// Each category gets its own vivid accent
export const CATEGORY_STYLES = {
  erp:           { color: "#1a73e8", border: "border-blue-400/25",    bg: "bg-blue-500/8" },
  analytics:     { color: "#fbbc04", border: "border-amber-400/25",   bg: "bg-amber-500/8" },
  ai:            { color: "#4285f4", border: "border-blue-400/25",    bg: "bg-blue-500/8" },
  clm:           { color: "#ea4335", border: "border-red-400/25",     bg: "bg-red-500/8" },
  "market-data": { color: "#34a853", border: "border-emerald-400/25", bg: "bg-emerald-500/8" },
  collaboration: { color: "#5f6368", border: "border-slate-400/25",   bg: "bg-slate-500/8" },
} as const;

// ─── Pipeline Layers (Architecture) ────────────────────
// Clear visual hierarchy: integration (calm) → ML (engaged) → LLM (vivid)
export const PIPELINE_STYLES = {
  integration: { label: "Integration & Orchestration", bg: "bg-slate-500/[0.06]",  border: "border-slate-400/15", textColor: "text-slate-500" },
  ml:          { label: "Traditional ML / Analytics",  bg: "bg-emerald-500/[0.06]", border: "border-emerald-400/15", textColor: "text-emerald-600" },
  llm:         { label: "LLM Reasoning",               bg: "bg-blue-500/[0.08]",   border: "border-blue-400/25",   textColor: "text-blue-700" },
} as const;

// ─── Domain Colors ─────────────────────────────────────
// Google Cloud-aligned categorical palette for dense periodic-table scanning.
export const DOMAIN_COLORS: Record<number, string> = {
  // HR (1-10)
  1:  "#1a73e8", 2:  "#34a853", 3:  "#4285f4", 4:  "#ea4335", 5:  "#fbbc04",
  6:  "#5f6368", 7:  "#188038", 8:  "#1967d2", 9:  "#00acc1", 10: "#202124",
  // Procurement (11-19)
  11: "#f29900", 12: "#00897b", 13: "#4285f4", 14: "#d93025", 15: "#fbbc04",
  16: "#6f6f6f", 17: "#34a853", 18: "#1a73e8", 19: "#00acc1",
  // Finance (20-28)
  20: "#00897b", 21: "#1a73e8", 22: "#f29900", 23: "#00acc1",
  24: "#4285f4", 25: "#ea4335", 26: "#5f6368", 27: "#fbbc04",
  28: "#202124",
  // Marketing (29-37)
  29: "#4285f4", 30: "#1a73e8", 31: "#ea4335", 32: "#00acc1",
  33: "#34a853", 34: "#f29900", 35: "#1967d2", 36: "#5f6368",
  37: "#00897b",
  // IT (38-46)
  38: "#1a73e8", 39: "#34a853", 40: "#4285f4", 41: "#ea4335",
  42: "#f29900", 43: "#1967d2", 44: "#00acc1", 45: "#5f6368",
  46: "#fbbc04",
};

// ─── Swimlane Lanes ────────────────────────────────────
export const LANE_STYLES = {
  human:  { bg: "bg-rose-500/[0.04]",   border: "border-rose-400/10",   label: "Human Actor",  labelBg: "bg-rose-500/10 text-rose-600" },
  agent:  { bg: "bg-blue-500/[0.04]",   border: "border-blue-400/10",   label: "Gemini Agent",  labelBg: "bg-blue-500/10 text-blue-600" },
  system: { bg: "bg-emerald-500/[0.04]", border: "border-emerald-400/10", label: "Systems",       labelBg: "bg-emerald-500/10 text-emerald-600" },
} as const;

export const NODE_STYLES = {
  trigger: "bg-amber-500/10 border-amber-400/20 text-amber-700 rounded-full",
  action:  "bg-blue-500/10 border-blue-400/20 text-blue-700 rounded-xl",
  hitl:    "bg-rose-500/10 border-rose-400/25 text-rose-700 rounded-xl border-dashed",
  output:  "bg-emerald-500/10 border-emerald-400/20 text-emerald-700 rounded-xl",
} as const;
