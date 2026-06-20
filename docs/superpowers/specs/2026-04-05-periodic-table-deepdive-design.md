# Periodic Table + Deep Dive Redesign

## Summary

Two major additions to the HR Transformation slide deck:

1. **Periodic Table of HR Agentic Capabilities** — a dense, interactive grid showing all 82 agents as "elements" with domain color, implementation layer, trigger type, and HITL markers. Replaces the current DomainMapSlide as the primary "see everything at once" navigation.

2. **Use Case Deep Dive** — redesigned UseCaseSlide with tabbed layout (Overview / Agent Workflow / Systems & Data) and a swimlane workflow visualization showing Human, Agent, and System lanes with animated data flow and HITL checkpoints.

## Design Language Constraints

Must use the existing theme from `src/index.css`:
- Primary: `#005bbf`, Primary Container: `#1a73e8`
- Background: `#f8f9fd`, Surface Container: `#eceef2`
- Tertiary: `#9e4300`, Secondary: `#5a5f64`
- Fonts: Manrope (headlines), Inter (body)
- Glass panels, `rounded-2xl`/`rounded-3xl`, Framer Motion animations
- Tailwind CSS v4 utility classes throughout
- All components are React + TypeScript

## Component 1: PeriodicTableSlide

### Data Model

Add to each use case's data:

```ts
type TriggerType = "event" | "chat" | "scheduled";

interface AgentElement {
  id: string;           // "uc-101"
  agentId: string;      // "A-101"  
  shortName: string;    // "Scenario Modeling"
  domain: number;       // 1-10
  layer: 1 | 2 | 3 | 4;
  triggerType: TriggerType;
  hitl?: boolean;       // true if human-in-the-loop
  hitlActor?: string;   // "Recruiter", "HRBP", "Manager"
}
```

Create a new constants file `src/constants/agents.ts` with all 82 agent element definitions (derived from existing slide data + trigger/HITL classifications).

### Visual Design

- Grid of 82 elements, 14 columns (matches the mockup density)
- Each element is a clickable card: ~62px tall, domain-colored background using theme-consistent colors
- Element shows: agent ID number (bold), short name (small), layer indicator dot, trigger type icon, HITL marker
- Layer dots use theme-consistent colors: L1 emerald, L2 blue, L3 violet, L4 amber
- Trigger types: ⚡ event (emerald badge), 💬 chat (blue badge), 🕐 scheduled (amber badge)
- HITL: small 👤 icon in top-right corner
- Hover: scale(1.08), shadow, primary border
- Click: navigates to that use case's slide via `goToSlide()`
- Legend bar below with domain colors, layer dots, trigger types, HITL explanation
- Summary stats: "82 Agents • 10 Domains • 4 Layers • 3 Trigger Types"
- Framer Motion stagger animation on mount

### Placement in Deck

- Replaces the current `DomainMapSlide` at slide position `domain-map`
- The old DomainMapSlide is removed
- Domain catalog slides remain — accessible from within use case slides ("Back to Domain" button)

## Component 2: Redesigned UseCaseSlide (Deep Dive)

### New Props

Add to `UseCaseSlideProps`:

```ts
triggerType?: TriggerType;
hitl?: { actor: string; action: string; description: string };
swimlane?: SwimlaneFlow;
```

### Layout — Tabbed Design

The UseCaseSlide becomes a tabbed experience with 2 tabs:

**Tab 1: Overview** (default)
- Header: icon + title + subtitle + layer badge + trigger badge + persona badge + HITL badge + back button
- Systems integration strip
- 2-column: Before/After panels (existing statusQuo/agentification)
- KPI metric strip (existing kpis)

**Tab 2: Agent Workflow**
- Swimlane visualization (see below)
- HITL callout panel (if applicable)

Tabs use the existing theme: `bg-surface-container-low` inactive, `border-primary` active indicator.

### Swimlane Workflow Component

New component: `src/components/SwimlaneFlow.tsx`

Data model:

```ts
interface SwimlaneNode {
  id: string;
  label: string;
  sublabel?: string;
  lane: "human" | "agent" | "system";
  type: "trigger" | "action" | "hitl" | "output";
  systems?: string[];
}

interface SwimlaneConnection {
  from: string;
  to: string;
}

interface SwimlaneFlow {
  nodes: SwimlaneNode[];
  connections: SwimlaneConnection[];
}
```

Visual:
- 3 horizontal lanes with labels: 👤 Human Actor (pink bg), 🤖 Gemini Agent (blue bg), ⚙️ Systems (green bg)
- Lane colors use theme variants: `bg-pink-50`, `bg-blue-50`, `bg-green-50` (consistent with theme)
- Nodes are styled cards within their lane, positioned left-to-right in flow order
- Connections shown as animated SVG paths between nodes, crossing lanes when needed
- HITL nodes have dashed borders and a prominent 👤 icon — visually distinct "gate"
- Trigger nodes have a distinctive entry shape (rounded pill, amber/green/blue based on trigger type)
- Output nodes have an "exit" shape
- Staggered Framer Motion entrance animation, node by node
- Compact height: ~200px total

### Trigger Type Badge (in header)

Replaces the generic trigger text:
- `event`: ⚡ lightning icon, emerald colors, label "Event-Driven"
- `chat`: 💬 chat icon, blue colors, label "Chat-Initiated"  
- `scheduled`: 🕐 clock icon, amber colors, label "Scheduled"

### HITL Badge + Callout

In header: pink badge with 👤 icon + actor name (e.g., "HITL: Recruiter Review")

In Workflow tab: callout panel below swimlane with dashed pink border:
- Actor (who)
- Action (what they do)
- Description (why this step requires human judgment)

## Component 3: Updated Domain Catalog Slides

No major changes — keep the existing card-based catalog format. The catalogs remain useful for navigating within a domain. Each card already links to the use case.

## Data Updates

All 82 use case files need:
- `triggerType` prop added
- `hitl` prop added where applicable (~20 agents have HITL)
- `swimlane` flow data (nodes + connections) — replaces the current `flow` prop

The trigger type and HITL classification for each agent is derived from the reference document's activity sequences and process descriptions.

## Files to Create/Modify

### New Files
- `src/constants/agents.ts` — 82 agent element definitions
- `src/components/PeriodicTableSlide.tsx` — periodic table component
- `src/components/SwimlaneFlow.tsx` — swimlane workflow component

### Modified Files
- `src/components/UseCaseSlide.tsx` — tabbed layout, trigger/HITL badges, swimlane integration
- `src/components/ProcessFlow.tsx` — can be removed once swimlane replaces it
- `src/config/slides.tsx` — replace DomainMapSlide with PeriodicTableSlide
- `src/index.css` — add swimlane lane colors if needed
- All 82 use case files — add triggerType, hitl, swimlane props

### Removed Files
- `src/components/slides/DomainMapSlide.tsx` — replaced by PeriodicTableSlide

## Implementation Order

1. Create `agents.ts` constants with all 82 element definitions
2. Build `PeriodicTableSlide` component  
3. Build `SwimlaneFlow` component
4. Redesign `UseCaseSlide` with tabs + new badges
5. Update `slides.tsx` to swap in periodic table
6. Update all 82 use case files with triggerType, hitl, swimlane data
7. Remove old DomainMapSlide and ProcessFlow
8. Build verification
