import { Landmark, Umbrella, RadioTower, Store, Factory, LucideIcon } from "lucide-react";
import { TriggerType } from "../constants/agents";
import { VerticalAgent, VerticalConfig, ValueStream } from "./types";

import bankingSeed from "./seeds/banking.json";
import insuranceSeed from "./seeds/insurance.json";
import telcoSeed from "./seeds/telco.json";
import retailSeed from "./seeds/retail.json";
import manufacturingSeed from "./seeds/manufacturing.json";

// ─── Seed shape (as authored in the factory catalog) ───────

interface SeedUseCase {
  id: string;
  title: string;
  persona: string;
  triggerType: string;
  systems: string[];
  kpis: { label: string; before: string; after: string }[];
  statusQuo: string[];
  agentification: string[];
}
interface SeedValueStream {
  code: string;
  name: string;
  useCases: SeedUseCase[];
}
interface Seed {
  industry: string;
  department: string;
  code: string;
  valueStreams: SeedValueStream[];
}

// ─── Per-industry presentation metadata ────────────────────
// Icons + accents are chosen here (not in the seeds) so the vertical
// switcher reads like the department switcher.

interface IndustryMeta {
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  accentColor: string;
  activeBg: string;
}

const INDUSTRY_META: Record<string, IndustryMeta> = {
  banking:       { label: "Banking",       shortLabel: "Banking",   icon: Landmark,   accentColor: "#1a73e8", activeBg: "bg-blue-600" },
  insurance:     { label: "Insurance",     shortLabel: "Insurance", icon: Umbrella,   accentColor: "#00897b", activeBg: "bg-teal-600" },
  telco:         { label: "Telecom",       shortLabel: "Telco",     icon: RadioTower, accentColor: "#7c3aed", activeBg: "bg-violet-600" },
  retail:        { label: "Retail",        shortLabel: "Retail",    icon: Store,      accentColor: "#ea580c", activeBg: "bg-orange-600" },
  manufacturing: { label: "Manufacturing", shortLabel: "Mfg",       icon: Factory,    accentColor: "#b45309", activeBg: "bg-amber-700" },
};

// Categorical palette for value-stream color-coding — Google Cloud-aligned,
// six entries so each of the six value streams in an industry gets a distinct
// accent for dense periodic-table scanning.
const STREAM_PALETTE = ["#1a73e8", "#34a853", "#f29900", "#ea4335", "#00acc1", "#7e57c2"];

// Seeds use "event-driven" / "on-demand" / "scheduled"; the presentation's
// trigger vocabulary is event / chat / scheduled.
function normalizeTrigger(raw: string): TriggerType {
  const t = raw.toLowerCase();
  if (t.includes("event")) return "event";
  if (t.includes("scheduled")) return "scheduled";
  return "chat"; // on-demand / user-initiated
}

// Numeric suffix of a value-stream code ("B-21" → 21) — this is the vertical
// domain number, kept in its own namespace separate from the horizontal
// domains 1–46.
function domainOf(code: string): number {
  const n = parseInt(code.split("-")[1] ?? "0", 10);
  return Number.isFinite(n) ? n : 0;
}

function transform(seed: Seed): VerticalConfig {
  const meta = INDUSTRY_META[seed.industry];
  if (!meta) throw new Error(`No industry metadata for vertical seed "${seed.industry}"`);

  const valueStreams: ValueStream[] = seed.valueStreams.map((vs, idx) => {
    const domain = domainOf(vs.code);
    const color = STREAM_PALETTE[idx % STREAM_PALETTE.length];
    const agents: VerticalAgent[] = vs.useCases.map((uc) => ({
      id: uc.id,
      title: uc.title,
      persona: uc.persona,
      triggerType: normalizeTrigger(uc.triggerType),
      systems: uc.systems,
      kpis: uc.kpis,
      statusQuo: uc.statusQuo,
      agentification: uc.agentification,
      valueStreamCode: vs.code,
      domain,
    }));
    return { code: vs.code, name: vs.name, domain, color, agents };
  });

  const agentCount = valueStreams.reduce((sum, vs) => sum + vs.agents.length, 0);

  return {
    key: seed.industry,
    label: meta.label,
    shortLabel: meta.shortLabel,
    code: seed.code,
    icon: meta.icon,
    accentColor: meta.accentColor,
    activeBg: meta.activeBg,
    valueStreams,
    agentCount,
    streamCount: valueStreams.length,
  };
}

// Order mirrors the catalog taxonomy industry ordering.
export const VERTICALS: VerticalConfig[] = [
  transform(retailSeed as Seed),
  transform(bankingSeed as Seed),
  transform(insuranceSeed as Seed),
  transform(telcoSeed as Seed),
  transform(manufacturingSeed as Seed),
];
