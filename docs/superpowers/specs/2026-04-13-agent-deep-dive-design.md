# Agent Deep Dive — Single-Scroll Redesign

## Goal

Replace the current 3-tab agent view (Overview, Agent Workflow, Systems & Impact) with a single vertically-scrollable page that tells the complete agent story — from pain point through architecture to governance. Add a rich architecture section showing system integration map and data flow pipeline.

## Architecture

The `UseCaseSlide` component is rewritten as a tabless, single-scroll layout. A new `architecture` prop is added to the existing `UseCaseSlideProps` interface. The hub-spoke diagram and data flow pipeline are new components rendered inline. All existing props remain backward-compatible.

## Data Structure

```typescript
// ─── New Types ──────────────────────────────────────

interface SystemConnection {
  system: string;           // "SAP S/4HANA MM" — real vendor + module
  description: string;      // "Material master, BOM structure, routing data"
  direction: "read" | "write" | "bidirectional";
  protocol?: string;        // "BAPI/RFC" | "REST API" | "BigQuery SQL" | "gRPC"
  dataExamples?: string[];  // ["Material #", "BOM level", "Routing steps"]
  category: "erp" | "analytics" | "ai" | "clm" | "market-data" | "collaboration";
}

interface PipelineStage {
  label: string;              // "Cost Regression"
  description: string;        // what happens at this stage
  systems: string[];          // systems involved at this stage
  layer: "integration" | "ml" | "llm";  // maps to three-layer capability model
  dataIn?: string;            // "BOM + commodity indices"
  dataOut?: string;           // "Parametric cost model with confidence ranges"
}

interface AgentArchitecture {
  connections: SystemConnection[];  // hub-spoke nodes
  pipeline: PipelineStage[];        // data flow stages
}

// ─── Updated UseCaseSlideProps ──────────────────────

interface UseCaseSlideProps {
  // Identity (unchanged)
  title: string;
  subtitle: string;
  icon: React.ElementType;
  domainId?: string;
  layer?: AgentLayer;
  persona?: string;
  triggerType?: TriggerType;

  // Section 1: Status Quo vs Agent (unchanged)
  statusQuo: string[];
  agentification: string[];

  // Section 2: Impact Metrics (unchanged)
  kpis?: KPI[];

  // Section 3: Agent Workflow (unchanged)
  swimlane?: SwimlaneFlow;
  flow?: FlowStep[];

  // Section 4: Architecture (NEW)
  architecture?: AgentArchitecture;

  // Section 5: Governance (unchanged)
  systems?: string[];
  hitl?: HITLConfig;
}
```

## Category Colors & Icons

Each `SystemConnection.category` maps to a visual treatment:

| Category | Color | Border | Example Systems |
|----------|-------|--------|----------------|
| `erp` | Blue #3b82f6 | blue-400 | SAP S/4HANA, Oracle ERP, Workday |
| `analytics` | Amber #f59e0b | amber-400 | BigQuery, Looker, Sievo, SpendHQ |
| `ai` | Violet #8b5cf6 | violet-400 | Vertex AI, Gemini, Document AI |
| `clm` | Red #ef4444 | red-400 | Icertis, DocuSign CLM, Agiloft |
| `market-data` | Emerald #10b981 | emerald-400 | S&P Platts, ICIS, Mintec, D&B |
| `collaboration` | Cyan #06b6d4 | cyan-400 | Google Slides, Slack, Email, Jira |

## Pipeline Layer Colors

Each `PipelineStage.layer` maps to the three-layer capability model:

| Layer | Color | Border | Label |
|-------|-------|--------|-------|
| `integration` | Blue bg-blue-50 | blue-200 | Integration & Orchestration |
| `ml` | Violet bg-violet-50 | violet-200 | Traditional ML / Analytics |
| `llm` | Gold bg-amber-50 | amber-400 (2px, highlighted) | LLM Reasoning ✦ |

The `llm` stage always gets a thicker border and gradient background to visually emphasize where the AI agent earns its name.

## Layout (5 Vertical Sections)

All sections render in a single scrollable column. Section labels use a thin horizontal rule with uppercase text.

### Section 1: Status Quo vs. Agent
- Two cards side by side (grid-cols-2)
- Left: gray background, numbered bullets (01, 02, 03)
- Right: blue tint, checkmark bullets
- Unchanged from current Overview tab

### Section 2: Impact Metrics
- Horizontal KPI strip (flex, 3-4 cards)
- Each card: label, before (strikethrough gray) → after (bold primary)
- Unchanged from current KPI rendering

### Section 3: Agent Workflow
- Compact 3-lane swimlane (human / agent / system)
- Inline rendering, no separate tab
- Lane labels on the left, nodes flow right
- Unchanged component, just rendered inline

### Section 4: Data Flow & System Architecture
- Two-column grid (grid-cols-2)
- Left: **Hub-Spoke Integration Map**
  - Agent at center (gradient circle with icon)
  - System nodes positioned radially around it
  - Each node shows: category-colored icon, system name, data description
  - Direction indicated by arrow line style (dashed = read, solid = write, double = bidirectional)
  - Protocol badge on hover or inline if space permits
- Right: **Data Flow Pipeline**
  - Vertical stack of pipeline stages
  - Each stage is a card with layer-colored background
  - Shows: stage label, description, systems involved, dataIn/dataOut
  - Downward arrows between stages
  - LLM stage visually highlighted (gold gradient, thicker border, ✦ marker)

### Section 5: Systems & Governance
- Two-column grid
- Left: system chips (flex-wrap, all system names)
- Right: HITL callout card (if applicable) — dashed pink border, avatar, role, action, description
- If no HITL, systems take full width

## Component Structure

```
UseCaseSlide.tsx          — single-scroll layout, renders all 5 sections
  ├── (inline)            — Section 1: before/after cards
  ├── (inline)            — Section 2: KPI strip
  ├── SwimlaneFlowComponent — Section 3: compact swimlane
  ├── HubSpokeMap.tsx     — Section 4 left: integration map (NEW)
  ├── DataFlowPipeline.tsx — Section 4 right: pipeline stages (NEW)
  └── (inline)            — Section 5: systems + HITL
```

### New Components

**`HubSpokeMap.tsx`**
- Props: `connections: SystemConnection[]`, `agentName: string`, `agentIcon: React.ElementType`
- Renders agent at center with radial system nodes
- Uses CSS positioning (absolute within relative container)
- Connection lines rendered as SVG paths or CSS borders
- Category determines node color, direction determines line style
- Responsive: adjusts node positions based on connection count

**`DataFlowPipeline.tsx`**
- Props: `stages: PipelineStage[]`
- Renders vertical sequence of stage cards
- Each card: layer-colored background, label, description, systems, dataIn/dataOut
- Arrow connectors between cards
- LLM stage gets special treatment (gold gradient, ✦, thicker border)

## Backward Compatibility

- The `architecture` prop is optional
- Agents without `architecture` data still render Sections 1-3 and 5 normally
- Section 4 only appears when `architecture` is provided
- All existing agent components continue to work without changes
- Architecture data can be added incrementally per agent

## Example Data — Should-Cost Modeler (A-1203)

```typescript
architecture: {
  connections: [
    {
      system: "SAP S/4HANA MM",
      description: "BOM structure, routing data, material master",
      direction: "read",
      protocol: "BAPI/RFC",
      dataExamples: ["Material #", "BOM levels", "Routing steps", "Work centers"],
      category: "erp",
    },
    {
      system: "S&P Global Platts",
      description: "Real-time commodity price indices",
      direction: "read",
      protocol: "REST API",
      dataExamples: ["Steel HRC", "Aluminum LME", "Copper"],
      category: "market-data",
    },
    {
      system: "ICIS",
      description: "Petrochemical and energy pricing",
      direction: "read",
      protocol: "REST API",
      dataExamples: ["Polymer prices", "Energy indices"],
      category: "market-data",
    },
    {
      system: "BigQuery",
      description: "Historical cost data, parametric model training set",
      direction: "bidirectional",
      protocol: "BigQuery SQL",
      dataExamples: ["Past should-costs", "Actual costs", "Variance history"],
      category: "analytics",
    },
    {
      system: "Vertex AI (Gemini)",
      description: "LLM reasoning over specs, gap analysis, narrative generation",
      direction: "bidirectional",
      protocol: "gRPC",
      dataExamples: ["Engineering specs", "Cost breakdown", "Negotiation brief"],
      category: "ai",
    },
    {
      system: "Icertis CLM",
      description: "Existing contract terms and pricing history",
      direction: "read",
      protocol: "REST API",
      dataExamples: ["Contract price", "Volume tiers", "Index formulas"],
      category: "clm",
    },
  ],
  pipeline: [
    {
      label: "Data Ingestion",
      description: "Pull BOM structure, routing data, and material specs from ERP. Fetch current commodity indices for all raw materials in the BOM.",
      systems: ["SAP S/4HANA MM", "S&P Global Platts", "ICIS"],
      layer: "integration",
      dataIn: "Sourcing event trigger with material specs",
      dataOut: "Structured BOM with current commodity prices",
    },
    {
      label: "Parametric Cost Regression",
      description: "Run regression model on historical cost drivers — raw material indices, labor rates by geography, energy costs, freight lanes. Generate clean-sheet cost buildup with confidence ranges.",
      systems: ["BigQuery ML", "Historical cost data"],
      layer: "ml",
      dataIn: "BOM + commodity indices + labor benchmarks",
      dataOut: "Parametric cost model with Monte Carlo ranges",
    },
    {
      label: "Spec Interpretation & Gap Analysis",
      description: "LLM reads engineering specifications to understand manufacturing processes required. When supplier quote is 30% above should-cost, reasons about plausible explanations — capability premium vs. cost inefficiency. Generates negotiation-ready breakdown.",
      systems: ["Vertex AI (Gemini)", "Icertis CLM"],
      layer: "llm",
      dataIn: "Cost model + engineering specs + supplier quote",
      dataOut: "Gap analysis with explanations + negotiation talking points",
    },
    {
      label: "Delivery & Action",
      description: "Should-cost model with confidence ranges, gap analysis vs. supplier quote, and negotiation playbook delivered to Category Manager for review before negotiation.",
      systems: ["Google Slides", "Email", "SAP Ariba Sourcing"],
      layer: "integration",
      dataIn: "Complete should-cost analysis",
      dataOut: "Approved negotiation package",
    },
  ],
}
```

## Rollout Strategy

1. Build `HubSpokeMap` and `DataFlowPipeline` components
2. Rewrite `UseCaseSlide` as single-scroll layout
3. Add `architecture` data to a pilot batch (e.g., Domain 12 — 12 agents)
4. Validate visual quality and data density
5. Extend to remaining agents incrementally (subagent-driven)

Agents without `architecture` data continue to render normally — the section simply doesn't appear.
