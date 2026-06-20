import { LucideIcon } from "lucide-react";
import { TriggerType } from "../constants/agents";

// ─── Story Content Types ───────────────────────────────────

export interface ChallengeItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface ChallengeData {
  title: string;
  items: ChallengeItem[];
  stat: string;
  statLabel: string;
  statDesc: string;
}

export interface PersonaData {
  title: string;
  desc: string;
  metrics: string;
  domains: number[];
  icon: LucideIcon;
  color: string;
}

export interface TimeBlock {
  time: string;
  activity: string;
  processes: string[];
  agentOpportunity?: string;
}

export interface PersonaDay {
  persona: string;
  intro: string;
  blocks: TimeBlock[];
}

export interface RACIData {
  personas: string[];
  matrix: string[][]; // R/C/I per domain
}

// ─── Domain & Agent Types ──────────────────────────────────

export interface DomainDef {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
}

export interface AgentDef {
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

// ─── Department Definition ─────────────────────────────────

export interface DepartmentConfig {
  key: string;                    // unique key: "hr", "procurement", "finance"
  label: string;                  // display name: "HR & People Ops"
  shortLabel: string;             // tab label: "HR"
  icon: LucideIcon;               // department icon
  accentColor: string;            // hex color for accents
  activeBg: string;               // tailwind bg class for active state
  domainRange: [number, number];  // inclusive [min, max] domain IDs

  // Landing page
  subtitle: string;               // e.g., "10 Domains • 82 Agents • 12 Personas"
  description: string;            // paragraph for department landing

  // Periodic table
  periodicTableTitle: string;
  periodicTableSubtitle: string;

  // Story content
  challenge: ChallengeData;
  personas: PersonaData[];
  dayInLife: PersonaDay[];
  raci: RACIData;

  // Domain colors for persona domain dots
  domainColors: Record<number, string>;

  // Tech landscape
  techLandscape: {
    asIs: { label: string; tools: string }[];
    toBe: { label: string; description: string }[];
    painPoint: string;
    benefit: string;
  };

  // Integration architecture
  integrationSystems: string[];           // e.g., ["Workday", "SAP SF", "ADP", ...]
  externalAgents: string[];               // e.g., ["Workday Agents", "SAP Agents", ...]

  // Transformation blueprint
  transformationSteps: {
    domain: string;
    activity: string;
    asIs: string;
    toBe: string;
    agentName: string;
    impact: string;
  }[];
}
