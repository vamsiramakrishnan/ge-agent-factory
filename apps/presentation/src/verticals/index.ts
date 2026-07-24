// ┌─────────────────────────────────────────────────────────┐
// │  VERTICAL (INDUSTRY) REGISTRY                             │
// │                                                          │
// │  The vertical axis of the enterprise capability map.     │
// │  Where DEPARTMENTS (src/departments) are the horizontal  │
// │  shared-services functions, VERTICALS are the industry-  │
// │  native agents — banking, insurance, telco, retail,      │
// │  manufacturing.                                          │
// │                                                          │
// │  To add a new industry:                                  │
// │  1. Drop its seed JSON in src/verticals/seeds/           │
// │  2. Add an INDUSTRY_META entry + import in load.ts       │
// │                                                          │
// │  The VerticalSwitcher and VerticalTableSlide read from   │
// │  this registry — zero further code changes needed.       │
// └─────────────────────────────────────────────────────────┘

import { VERTICALS } from "./load";
import { VerticalConfig } from "./types";

export { VERTICALS };

export const getVertical = (key: string): VerticalConfig => {
  const v = VERTICALS.find((x) => x.key === key);
  if (!v) throw new Error(`Vertical "${key}" not found in registry`);
  return v;
};

export const getVerticalKeys = (): string[] => VERTICALS.map((v) => v.key);

export type { VerticalConfig, ValueStream, VerticalAgent, VerticalKPI } from "./types";
