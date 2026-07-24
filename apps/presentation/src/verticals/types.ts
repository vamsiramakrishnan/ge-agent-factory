import { LucideIcon } from "lucide-react";
import { TriggerType } from "../constants/agents";

// ─── Vertical (Industry) Agent Types ───────────────────────
//
// The horizontal axis (src/departments, src/constants) models cross-industry
// shared-services agents. This vertical axis models INDUSTRY-native agents —
// the ones that only exist because the enterprise is a bank, an insurer, a
// telco, a retailer, or a manufacturer.
//
// Every field here is sourced verbatim from the factory catalog vertical
// seeds (apps/factory/catalog/vertical-seeds/*.json), vendored into
// src/verticals/seeds/. No persona/day-in-life/RACI content is invented —
// the seeds carry persona, trigger, systems, KPIs, status quo, and the
// agentification narrative, and that is exactly what we render.

export interface VerticalKPI {
  label: string;
  before: string;
  after: string;
}

export interface VerticalAgent {
  id: string;
  title: string;
  persona: string;
  triggerType: TriggerType;
  systems: string[];
  kpis: VerticalKPI[];
  statusQuo: string[];
  agentification: string[];
  valueStreamCode: string; // e.g. "B-21"
  domain: number;          // numeric suffix of the value-stream code, e.g. 21
}

export interface ValueStream {
  code: string;   // "B-21"
  name: string;   // "Retail Banking & Deposits"
  domain: number; // 21
  color: string;  // categorical accent for periodic-table scanning
  agents: VerticalAgent[];
}

export interface VerticalConfig {
  key: string;         // "banking"
  label: string;       // "Banking"
  shortLabel: string;  // tab label, "Banking"
  code: string;        // industry code, "B"
  icon: LucideIcon;
  accentColor: string; // hex accent
  activeBg: string;    // tailwind bg class for the active switcher tab
  valueStreams: ValueStream[];
  agentCount: number;
  streamCount: number;
}
