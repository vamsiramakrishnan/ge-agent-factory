# Procurement Department Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 78 Procurement AI agents across 9 domains to the existing HR Transformation app, following the established pattern of individual use case components, domain catalogs, and periodic table integration.

**Architecture:** Procurement domains use IDs 11-19 (continuing from HR's 1-10). Each domain gets a catalog component and individual use case components, all wired into the existing SLIDES array and AGENTS constant. The periodic table automatically renders new agents via the AGENTS array.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Motion (Framer Motion), Lucide React icons, Vite

**Spec Document:** `docs/design-specs/specs/2026-04-13-procurement-agent-catalog.md` — contains all 78 agent definitions with three-layer breakdown (Integration & Orchestration, Traditional ML, LLM Reasoning), systems, triggers, HITL gates, personas, and KPIs.

---

## Domain-to-ID Mapping

| Domain | ID | Parent Domain | Agents | Use Case IDs |
|--------|-----|--------------|--------|-------------|
| P1: Strategy & Demand Planning | 11 | domain-map | 7 | uc-1101 to uc-1107 |
| P2: Strategic Sourcing & Category Mgmt | 12 | domain-map | 12 | uc-1201 to uc-1212 |
| P3: Supplier Discovery & Qualification | 13 | domain-map | 8 | uc-1301 to uc-1308 |
| P4: Contract Lifecycle Management | 14 | domain-map | 9 | uc-1401 to uc-1409 |
| P5: Procure-to-Pay Operations | 15 | domain-map | 11 | uc-1501 to uc-1511 |
| P6: Supplier Risk & Compliance | 16 | domain-map | 8 | uc-1601 to uc-1608 |
| P7: Supplier Performance & Relationship | 17 | domain-map | 7 | uc-1701 to uc-1707 |
| P8: Indirect & Tail Spend Mgmt | 18 | domain-map | 6 | uc-1801 to uc-1806 |
| P9: Spend Analytics & Intelligence | 19 | domain-map | 10 | uc-1901 to uc-1910 |

---

## Task 1: Add Procurement Domains to Constants

**Files:**
- Modify: `src/constants/domains.ts`

- [ ] **Step 1: Add 9 Procurement domains to domains.ts**

```typescript
import { 
  BarChart3, 
  UserPlus, 
  Trophy, 
  Scale, 
  GraduationCap, 
  ShieldCheck, 
  Heart, 
  Settings, 
  Users, 
  LineChart,
  // Procurement icons
  Target,
  Layers,
  Search,
  FileSignature,
  CreditCard,
  AlertTriangle,
  Star,
  ShoppingCart,
  TrendingUp
} from "lucide-react";

export const DOMAINS = [
  // HR Domains (1-10)
  { id: "domain-1", title: "Workforce Planning", icon: BarChart3, color: "#3b82f6" },
  { id: "domain-2", title: "Talent Acquisition", icon: UserPlus, color: "#10b981" },
  { id: "domain-3", title: "Performance Mgmt", icon: Trophy, color: "#8b5cf6" },
  { id: "domain-4", title: "Total Rewards", icon: Scale, color: "#ef4444" },
  { id: "domain-5", title: "Learning & Dev", icon: GraduationCap, color: "#f59e0b" },
  { id: "domain-6", title: "ER & Compliance", icon: ShieldCheck, color: "#4b5563" },
  { id: "domain-7", title: "Engagement", icon: Heart, color: "#ec4899" },
  { id: "domain-8", title: "HR Operations", icon: Settings, color: "#6366f1" },
  { id: "domain-9", title: "DEI & Belonging", icon: Users, color: "#06b6d4" },
  { id: "domain-10", title: "People Analytics", icon: LineChart, color: "#111827" },
  // Procurement Domains (11-19)
  { id: "domain-11", title: "Procurement Strategy", icon: Target, color: "#ea580c" },
  { id: "domain-12", title: "Strategic Sourcing", icon: Layers, color: "#0d9488" },
  { id: "domain-13", title: "Supplier Discovery", icon: Search, color: "#7c3aed" },
  { id: "domain-14", title: "Contract Lifecycle", icon: FileSignature, color: "#dc2626" },
  { id: "domain-15", title: "Procure-to-Pay", icon: CreditCard, color: "#ca8a04" },
  { id: "domain-16", title: "Supplier Risk", icon: AlertTriangle, color: "#57534e" },
  { id: "domain-17", title: "Supplier Performance", icon: Star, color: "#db2777" },
  { id: "domain-18", title: "Indirect & Tail Spend", icon: ShoppingCart, color: "#4f46e5" },
  { id: "domain-19", title: "Spend Analytics", icon: TrendingUp, color: "#0891b2" },
];
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd /home/user/fde-agent-factory && npx tsc --noEmit src/constants/domains.ts 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/constants/domains.ts
git commit -m "feat: add 9 Procurement domains to domain constants"
```

---

## Task 2: Add Procurement Agents to Constants

**Files:**
- Modify: `src/constants/agents.ts`

- [ ] **Step 1: Add all 78 Procurement agents to AGENTS array**

Append after the Domain 10 entries (line 113) in `src/constants/agents.ts`:

```typescript
  // ═══════════════════════════════════════════════
  // PROCUREMENT DOMAINS (11-19)
  // ═══════════════════════════════════════════════

  // Domain 11 - Procurement Strategy & Demand Planning (7 agents)
  { id: "uc-1101", agentId: "A-1101", shortName: "Category Strategy", domain: 11, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Category Director", hitlAction: "Approve category strategy" },
  { id: "uc-1102", agentId: "A-1102", shortName: "Demand Forecast", domain: 11, layer: 4, triggerType: "scheduled" },
  { id: "uc-1103", agentId: "A-1103", shortName: "Make vs Buy", domain: 11, layer: 3, triggerType: "event", hitl: true, hitlActor: "CPO", hitlAction: "Approve make-vs-buy decision" },
  { id: "uc-1104", agentId: "A-1104", shortName: "Policy Assistant", domain: 11, layer: 1, triggerType: "chat" },
  { id: "uc-1105", agentId: "A-1105", shortName: "Savings Pipeline", domain: 11, layer: 4, triggerType: "scheduled" },
  { id: "uc-1106", agentId: "A-1106", shortName: "Maturity Assess", domain: 11, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "CPO", hitlAction: "Review maturity assessment" },
  { id: "uc-1107", agentId: "A-1107", shortName: "Stakeholder CSAT", domain: 11, layer: 4, triggerType: "scheduled" },

  // Domain 12 - Strategic Sourcing & Category Management (12 agents)
  { id: "uc-1201", agentId: "A-1201", shortName: "Spend Classify", domain: 12, layer: 4, triggerType: "scheduled" },
  { id: "uc-1202", agentId: "A-1202", shortName: "Market Intel", domain: 12, layer: 3, triggerType: "scheduled" },
  { id: "uc-1203", agentId: "A-1203", shortName: "Should-Cost", domain: 12, layer: 3, triggerType: "event", hitl: true, hitlActor: "Category Manager", hitlAction: "Review should-cost model" },
  { id: "uc-1204", agentId: "A-1204", shortName: "RFx Builder", domain: 12, layer: 3, triggerType: "event", hitl: true, hitlActor: "Sourcing Lead", hitlAction: "Approve RFx package" },
  { id: "uc-1205", agentId: "A-1205", shortName: "Bid Evaluation", domain: 12, layer: 3, triggerType: "event", hitl: true, hitlActor: "Sourcing Committee", hitlAction: "Award decision" },
  { id: "uc-1206", agentId: "A-1206", shortName: "Auction Advisor", domain: 12, layer: 3, triggerType: "event" },
  { id: "uc-1207", agentId: "A-1207", shortName: "Negotiation Prep", domain: 12, layer: 3, triggerType: "event" },
  { id: "uc-1208", agentId: "A-1208", shortName: "Category Spend", domain: 12, layer: 4, triggerType: "scheduled" },
  { id: "uc-1209", agentId: "A-1209", shortName: "Sole Source", domain: 12, layer: 1, triggerType: "event", hitl: true, hitlActor: "CPO", hitlAction: "Approve sole source justification" },
  { id: "uc-1210", agentId: "A-1210", shortName: "Category Roadmap", domain: 12, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Category Director", hitlAction: "Approve roadmap" },
  { id: "uc-1211", agentId: "A-1211", shortName: "Spec Standard", domain: 12, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Engineering", hitlAction: "Validate spec consolidation" },
  { id: "uc-1212", agentId: "A-1212", shortName: "Channel Optimizer", domain: 12, layer: 4, triggerType: "scheduled" },

  // Domain 13 - Supplier Discovery & Qualification (8 agents)
  { id: "uc-1301", agentId: "A-1301", shortName: "Discovery Match", domain: 13, layer: 3, triggerType: "event" },
  { id: "uc-1302", agentId: "A-1302", shortName: "Pre-Qual Screen", domain: 13, layer: 3, triggerType: "event", hitl: true, hitlActor: "Sourcing Lead", hitlAction: "Review qualification" },
  { id: "uc-1303", agentId: "A-1303", shortName: "Financial Health", domain: 13, layer: 4, triggerType: "scheduled" },
  { id: "uc-1304", agentId: "A-1304", shortName: "Diversity Track", domain: 13, layer: 4, triggerType: "scheduled" },
  { id: "uc-1305", agentId: "A-1305", shortName: "Onboard Orch", domain: 13, layer: 2, triggerType: "event" },
  { id: "uc-1306", agentId: "A-1306", shortName: "Capability Assess", domain: 13, layer: 3, triggerType: "event" },
  { id: "uc-1307", agentId: "A-1307", shortName: "Consolidation", domain: 13, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "Category Manager", hitlAction: "Approve consolidation plan" },
  { id: "uc-1308", agentId: "A-1308", shortName: "Sanctions Screen", domain: 13, layer: 3, triggerType: "event", hitl: true, hitlActor: "Compliance", hitlAction: "Review screening results" },

  // Domain 14 - Contract Lifecycle Management (9 agents)
  { id: "uc-1401", agentId: "A-1401", shortName: "Contract Author", domain: 14, layer: 3, triggerType: "event", hitl: true, hitlActor: "Legal", hitlAction: "Review contract draft" },
  { id: "uc-1402", agentId: "A-1402", shortName: "Clause Risk", domain: 14, layer: 3, triggerType: "event", hitl: true, hitlActor: "Legal Counsel", hitlAction: "Review risk assessment" },
  { id: "uc-1403", agentId: "A-1403", shortName: "Obligation Mine", domain: 14, layer: 3, triggerType: "event" },
  { id: "uc-1404", agentId: "A-1404", shortName: "Renewal Monitor", domain: 14, layer: 2, triggerType: "scheduled", hitl: true, hitlActor: "Contract Manager", hitlAction: "Decide renewal action" },
  { id: "uc-1405", agentId: "A-1405", shortName: "Redline Compare", domain: 14, layer: 3, triggerType: "event" },
  { id: "uc-1406", agentId: "A-1406", shortName: "Compliance Audit", domain: 14, layer: 4, triggerType: "scheduled" },
  { id: "uc-1407", agentId: "A-1407", shortName: "Agreement Graph", domain: 14, layer: 4, triggerType: "event" },
  { id: "uc-1408", agentId: "A-1408", shortName: "Contract Dash", domain: 14, layer: 4, triggerType: "scheduled" },
  { id: "uc-1409", agentId: "A-1409", shortName: "FM Advisor", domain: 14, layer: 3, triggerType: "chat", hitl: true, hitlActor: "Legal + CPO", hitlAction: "Approve termination strategy" },

  // Domain 15 - Procure-to-Pay Operations (11 agents)
  { id: "uc-1501", agentId: "A-1501", shortName: "Req Routing", domain: 15, layer: 2, triggerType: "event" },
  { id: "uc-1502", agentId: "A-1502", shortName: "PO Auto-Gen", domain: 15, layer: 2, triggerType: "event" },
  { id: "uc-1503", agentId: "A-1503", shortName: "3-Way Match", domain: 15, layer: 3, triggerType: "event", hitl: true, hitlActor: "AP Manager", hitlAction: "Approve exception above threshold" },
  { id: "uc-1504", agentId: "A-1504", shortName: "Invoice Extract", domain: 15, layer: 3, triggerType: "event" },
  { id: "uc-1505", agentId: "A-1505", shortName: "Dup Payment", domain: 15, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "AP Manager", hitlAction: "Confirm duplicate flags" },
  { id: "uc-1506", agentId: "A-1506", shortName: "Maverick Nudge", domain: 15, layer: 3, triggerType: "event" },
  { id: "uc-1507", agentId: "A-1507", shortName: "Payment Optimize", domain: 15, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "Treasury", hitlAction: "Approve payment strategy" },
  { id: "uc-1508", agentId: "A-1508", shortName: "GR Validator", domain: 15, layer: 2, triggerType: "event" },
  { id: "uc-1509", agentId: "A-1509", shortName: "P2P Cycle Time", domain: 15, layer: 4, triggerType: "scheduled" },
  { id: "uc-1510", agentId: "A-1510", shortName: "Approval Opt", domain: 15, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "P2P Ops Manager", hitlAction: "Approve workflow changes" },
  { id: "uc-1511", agentId: "A-1511", shortName: "P-Card Recon", domain: 15, layer: 2, triggerType: "event" },

  // Domain 16 - Supplier Risk & Compliance (8 agents)
  { id: "uc-1601", agentId: "A-1601", shortName: "Risk Scoring", domain: 16, layer: 4, triggerType: "scheduled" },
  { id: "uc-1602", agentId: "A-1602", shortName: "Disruption Mon", domain: 16, layer: 3, triggerType: "scheduled" },
  { id: "uc-1603", agentId: "A-1603", shortName: "Sanctions Watch", domain: 16, layer: 3, triggerType: "event", hitl: true, hitlActor: "Compliance Manager", hitlAction: "Review sanctions matches" },
  { id: "uc-1604", agentId: "A-1604", shortName: "Reg Compliance", domain: 16, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Compliance Manager", hitlAction: "Review regulatory gaps" },
  { id: "uc-1605", agentId: "A-1605", shortName: "Sub-Tier Map", domain: 16, layer: 3, triggerType: "scheduled", hitl: true, hitlActor: "Supply Chain Lead", hitlAction: "Review sub-tier findings" },
  { id: "uc-1606", agentId: "A-1606", shortName: "Audit Tracker", domain: 16, layer: 2, triggerType: "event" },
  { id: "uc-1607", agentId: "A-1607", shortName: "Concentration", domain: 16, layer: 4, triggerType: "scheduled", hitl: true, hitlActor: "CPO", hitlAction: "Review concentration risks" },
  { id: "uc-1608", agentId: "A-1608", shortName: "Insurance Mon", domain: 16, layer: 2, triggerType: "scheduled" },

  // Domain 17 - Supplier Performance & Relationship Management (7 agents)
  { id: "uc-1701", agentId: "A-1701", shortName: "Scorecard Gen", domain: 17, layer: 4, triggerType: "scheduled" },
  { id: "uc-1702", agentId: "A-1702", shortName: "Quality Analyze", domain: 17, layer: 3, triggerType: "event" },
  { id: "uc-1703", agentId: "A-1703", shortName: "Delivery Perf", domain: 17, layer: 4, triggerType: "scheduled" },
  { id: "uc-1704", agentId: "A-1704", shortName: "QBR Prep", domain: 17, layer: 1, triggerType: "scheduled" },
  { id: "uc-1705", agentId: "A-1705", shortName: "Supplier Dev", domain: 17, layer: 3, triggerType: "event", hitl: true, hitlActor: "Category Manager", hitlAction: "Approve development plan" },
  { id: "uc-1706", agentId: "A-1706", shortName: "Relationship Health", domain: 17, layer: 3, triggerType: "scheduled" },
  { id: "uc-1707", agentId: "A-1707", shortName: "Innovation Track", domain: 17, layer: 3, triggerType: "event", hitl: true, hitlActor: "Category Manager", hitlAction: "Evaluate innovation proposal" },

  // Domain 18 - Indirect & Tail Spend Management (6 agents)
  { id: "uc-1801", agentId: "A-1801", shortName: "Tail Spend", domain: 18, layer: 4, triggerType: "scheduled" },
  { id: "uc-1802", agentId: "A-1802", shortName: "Catalog Curate", domain: 18, layer: 2, triggerType: "event" },
  { id: "uc-1803", agentId: "A-1803", shortName: "Spot Buy", domain: 18, layer: 3, triggerType: "event", hitl: true, hitlActor: "Buyer", hitlAction: "Approve spot buy above threshold" },
  { id: "uc-1804", agentId: "A-1804", shortName: "MRO Optimize", domain: 18, layer: 4, triggerType: "scheduled" },
  { id: "uc-1805", agentId: "A-1805", shortName: "T&E Compliance", domain: 18, layer: 2, triggerType: "event" },
  { id: "uc-1806", agentId: "A-1806", shortName: "SOW Manager", domain: 18, layer: 3, triggerType: "event", hitl: true, hitlActor: "Procurement Lead", hitlAction: "Review scope change" },

  // Domain 19 - Spend Analytics & Procurement Intelligence (10 agents)
  { id: "uc-1901", agentId: "A-1901", shortName: "Spend Cube", domain: 19, layer: 4, triggerType: "scheduled" },
  { id: "uc-1902", agentId: "A-1902", shortName: "Savings Track", domain: 19, layer: 4, triggerType: "scheduled" },
  { id: "uc-1903", agentId: "A-1903", shortName: "Commodity Price", domain: 19, layer: 4, triggerType: "scheduled" },
  { id: "uc-1904", agentId: "A-1904", shortName: "Procurement KPI", domain: 19, layer: 4, triggerType: "scheduled" },
  { id: "uc-1905", agentId: "A-1905", shortName: "TCO Modeler", domain: 19, layer: 3, triggerType: "event", hitl: true, hitlActor: "Category Manager", hitlAction: "Validate TCO assumptions" },
  { id: "uc-1906", agentId: "A-1906", shortName: "Value Reporter", domain: 19, layer: 1, triggerType: "scheduled", hitl: true, hitlActor: "CPO", hitlAction: "Review executive report" },
  { id: "uc-1907", agentId: "A-1907", shortName: "Price Variance", domain: 19, layer: 4, triggerType: "scheduled" },
  { id: "uc-1908", agentId: "A-1908", shortName: "Demand Pattern", domain: 19, layer: 4, triggerType: "scheduled" },
  { id: "uc-1909", agentId: "A-1909", shortName: "Benchmark Intel", domain: 19, layer: 3, triggerType: "chat" },
  { id: "uc-1910", agentId: "A-1910", shortName: "What-If Sim", domain: 19, layer: 3, triggerType: "chat" },
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd /home/user/fde-agent-factory && npx tsc --noEmit src/constants/agents.ts 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/constants/agents.ts
git commit -m "feat: add 78 Procurement agents to agent constants"
```

---

## Task 3: Create Domain 11 — Procurement Strategy & Demand Planning (7 agents)

**Files:**
- Create: `src/components/slides/domains/ProcurementStrategyCatalog.tsx`
- Create: `src/components/slides/use-cases/procurement/CategoryStrategyGenerator.tsx`
- Create: `src/components/slides/use-cases/procurement/DemandForecastingAggregation.tsx`
- Create: `src/components/slides/use-cases/procurement/MakeVsBuyAnalyzer.tsx`
- Create: `src/components/slides/use-cases/procurement/ProcurementPolicyAssistant.tsx`
- Create: `src/components/slides/use-cases/procurement/SavingsPipelineTracker.tsx`
- Create: `src/components/slides/use-cases/procurement/ProcurementMaturityAssessor.tsx`
- Create: `src/components/slides/use-cases/procurement/StakeholderSatisfactionAnalyzer.tsx`

**Reference:** Read spec sections P1-01 through P1-07 in `docs/design-specs/specs/2026-04-13-procurement-agent-catalog.md` for detailed agent definitions including three-layer breakdown, systems, triggers, and HITL gates.

**Instructions:** For each agent, create a component following the exact pattern of the existing HR use cases (e.g., `src/components/slides/use-cases/WorkforceScenarioModeling.tsx`). Each component must:

1. Import `UseCaseSlide` from `../../UseCaseSlide`
2. Import `FlowStep` from `../../ProcessFlow` and `SwimlaneFlow` from `../../SwimlaneFlow`
3. Import relevant Lucide icons
4. Define a `swimlane` with 4-6 nodes across human/agent/system lanes
5. Define a `flow` with 3-5 FlowStep entries
6. Export a named component that renders `<UseCaseSlide>` with all props:
   - `title`: Full agent name
   - `subtitle`: Format `"A-NNNN • Domain Name"` (e.g., `"A-1101 • Procurement Strategy"`)
   - `icon`: Relevant Lucide icon
   - `domainId`: `"domain-11"` for this domain
   - `layer`: One of `"Layer 1: OOTB"`, `"Layer 2: Agent Designer"`, `"Layer 3: Custom ADK"`, `"Layer 4: Data Agent"`
   - `persona`: Primary user role from spec
   - `systems`: Array of real vendor names from spec (e.g., `["SAP Ariba", "Coupa", "BigQuery", "Vertex AI"]`)
   - `kpis`: Array of 3-4 `{ label, before, after }` objects with realistic procurement metrics
   - `triggerType`: `"event"` | `"chat"` | `"scheduled"`
   - `hitl`: If applicable, `{ actor, action, description }` from spec
   - `swimlane`: The SwimlaneFlow object
   - `flow`: The FlowStep array
   - `statusQuo`: 3 bullets describing current manual pain points (from spec's Integration & Orchestration + current reality)
   - `agentification`: 3 bullets describing agent-powered improvements (from spec's LLM Reasoning layer — emphasize where the LLM actually reasons)

**Key rules for content quality:**
- `statusQuo` must describe real procurement pain that a CPO would recognize
- `agentification` must emphasize where LLM reasoning adds value (not just automation)
- `systems` must use real vendor names (SAP Ariba, Coupa, Icertis, etc.)
- `kpis` must have realistic before/after values grounded in procurement benchmarks

- [ ] **Step 1: Create the `procurement` subdirectory**

Run: `mkdir -p /home/user/fde-agent-factory/src/components/slides/use-cases/procurement`

- [ ] **Step 2: Create the domain catalog component**

Create `src/components/slides/domains/ProcurementStrategyCatalog.tsx`:

```tsx
import React from "react";
import { DomainCatalogSlide } from "../DomainCatalogSlide";
import { Target, TrendingUp, GitBranch, HelpCircle, PiggyBank, Activity, Users } from "lucide-react";

export const ProcurementStrategyCatalog = () => (
  <DomainCatalogSlide
    title="Procurement Strategy & Demand Planning"
    subtitle="Domain 11 • Plan"
    description="Strategic planning agents that drive category strategy, forecast demand, and track savings pipeline — shifting procurement from reactive buying to proactive value creation."
    color="#ea580c"
    useCases={[
      { id: "uc-1101", title: "Category Strategy Generator", icon: Target, description: "RAG-powered category strategy drafting with spend analysis, market context, and savings targets." },
      { id: "uc-1102", title: "Demand Forecasting", icon: TrendingUp, description: "Time-series demand forecasting with NLP parsing of stakeholder signals." },
      { id: "uc-1103", title: "Make-vs-Buy Analyzer", icon: GitBranch, description: "Multi-criteria TCO analysis with Monte Carlo simulation for insource/outsource decisions." },
      { id: "uc-1104", title: "Policy Assistant", icon: HelpCircle, description: "Conversational Q&A over procurement policies with approval matrix and delegation rules." },
      { id: "uc-1105", title: "Savings Pipeline Tracker", icon: PiggyBank, description: "ML classification of savings types with realization probability scoring and leakage detection." },
      { id: "uc-1106", title: "Maturity Assessor", icon: Activity, description: "NLP analysis of self-assessments against Hackett/CAPS maturity frameworks." },
      { id: "uc-1107", title: "Stakeholder Satisfaction", icon: Users, description: "Sentiment analysis on internal customer feedback with root cause identification." },
    ]}
  />
);
```

- [ ] **Step 3: Create all 7 use case components**

Create each component file in `src/components/slides/use-cases/procurement/` following the pattern. Read the spec document P1-01 through P1-07 for the agent-specific content (systems, AI techniques, three-layer breakdown). Generate realistic statusQuo, agentification, kpis, flow, and swimlane data that reflects the spec's depth.

Example for the first agent — `CategoryStrategyGenerator.tsx`:

```tsx
import React from "react";
import { UseCaseSlide } from "../../../UseCaseSlide";
import { FlowStep } from "../../../ProcessFlow";
import { SwimlaneFlow } from "../../../SwimlaneFlow";
import { Target, Database, Brain, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly Trigger", lane: "system", type: "trigger" },
    { id: "a1", label: "Spend Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Market Synthesis", lane: "agent", type: "action" },
    { id: "a3", label: "Strategy Draft", lane: "agent", type: "output" },
    { id: "h1", label: "Director Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Spend Ingest", icon: Database, description: "Historical spend data aggregated from Ariba and Coupa.", trigger: "Quarterly cycle", systems: ["SAP Ariba", "Coupa"] },
  { label: "Market Analysis", icon: Brain, description: "Gemini synthesizes market intelligence and supplier landscape.", systems: ["Vertex AI", "BigQuery"], integration: "ADK" },
  { label: "Strategy Draft", icon: FileText, description: "Category strategy document with savings targets and risk profile.", systems: ["Vertex AI"], output: "Strategy Doc" },
  { label: "Director Approval", icon: CheckCircle, description: "Category Director reviews and approves strategy.", output: "Approved Strategy" },
];

export const CategoryStrategyGenerator = () => (
  <UseCaseSlide
    title="Category Strategy Generator"
    subtitle="A-1101 • Procurement Strategy"
    icon={Target}
    domainId="domain-11"
    layer="Layer 3: Custom ADK"
    persona="Category Director"
    systems={["SAP Ariba Category Mgmt", "Coupa", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Strategy creation", before: "4-6 weeks", after: "2 days" },
      { label: "Data sources", before: "3-4 manual", after: "15+ automated" },
      { label: "Savings identified", before: "Gut feel", after: "Data-validated" },
    ]}
    triggerType="scheduled"
    hitl={{ actor: "Category Director", action: "Approve category strategy", description: "Director validates strategy recommendations, savings targets, and risk assessment before stakeholder distribution." }}
    swimlane={swimlane}
    flow={flow}
    statusQuo={[
      "Category strategies built manually in PowerPoint from fragmented spend data across 3+ systems.",
      "Market intelligence gathered through ad-hoc analyst calls and outdated industry reports.",
      "Savings targets set based on historical precedent rather than data-driven opportunity analysis."
    ]}
    agentification={[
      "Gemini synthesizes 3 years of spend data, market intelligence, and supplier performance into a coherent strategy narrative with validated savings levers.",
      "LLM reasons about which savings levers are realistic given category maturity — consolidation vs. spec change vs. demand management.",
      "Generates a board-ready strategy document with trade-offs, not just a data dump — something a Category Director can present to leadership."
    ]}
  />
);
```

Create the remaining 6 agents (`DemandForecastingAggregation.tsx`, `MakeVsBuyAnalyzer.tsx`, `ProcurementPolicyAssistant.tsx`, `SavingsPipelineTracker.tsx`, `ProcurementMaturityAssessor.tsx`, `StakeholderSatisfactionAnalyzer.tsx`) following this exact pattern, using the spec for each agent's specific content.

- [ ] **Step 4: Verify all files compile**

Run: `cd /home/user/fde-agent-factory && npx tsc --noEmit src/components/slides/use-cases/procurement/*.tsx 2>&1 | head -20`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/slides/domains/ProcurementStrategyCatalog.tsx
git add src/components/slides/use-cases/procurement/
git commit -m "feat: add Domain 11 — Procurement Strategy & Demand Planning (7 agents)"
```

---

## Task 4: Create Domain 12 — Strategic Sourcing & Category Management (12 agents)

**Files:**
- Create: `src/components/slides/domains/StrategicSourcingCatalog.tsx`
- Create: 12 use case components in `src/components/slides/use-cases/procurement/`

**Reference:** Read spec sections P2-01 through P2-12.

**Instructions:** Follow exact same pattern as Task 3. Domain color: `#0d9488`. Domain ID: `domain-12`. Agent IDs: `A-1201` through `A-1212`. Subtitle domain: `"Strategic Sourcing"`.

Agent files to create:
1. `SpendClassificationEnrichment.tsx` — P2-01 — Layer 4, Scheduled
2. `MarketIntelligenceMonitor.tsx` — P2-02 — Layer 3, Scheduled
3. `ShouldCostModeler.tsx` — P2-03 — Layer 3, Event, HITL: Category Manager
4. `RFxBuilderOrchestrator.tsx` — P2-04 — Layer 3, Event, HITL: Sourcing Lead
5. `BidEvaluationAnalyzer.tsx` — P2-05 — Layer 3, Event, HITL: Sourcing Committee
6. `AuctionStrategyAdvisor.tsx` — P2-06 — Layer 3, Event
7. `NegotiationPrepAgent.tsx` — P2-07 — Layer 3, Event
8. `CategorySpendDashboard.tsx` — P2-08 — Layer 4, Scheduled
9. `SoleSourceJustification.tsx` — P2-09 — Layer 1, Event, HITL: CPO
10. `CategoryRoadmapPlanner.tsx` — P2-10 — Layer 3, Scheduled, HITL: Category Director
11. `SpecStandardizationAgent.tsx` — P2-11 — Layer 3, Scheduled, HITL: Engineering
12. `SourcingChannelOptimizer.tsx` — P2-12 — Layer 4, Scheduled

- [ ] **Step 1: Create domain catalog** — `StrategicSourcingCatalog.tsx`
- [ ] **Step 2: Create all 12 use case components** — each reading its spec section for content
- [ ] **Step 3: Verify compilation**
- [ ] **Step 4: Commit** — `"feat: add Domain 12 — Strategic Sourcing & Category Mgmt (12 agents)"`

---

## Task 5: Create Domain 13 — Supplier Discovery & Qualification (8 agents)

**Files:**
- Create: `src/components/slides/domains/SupplierDiscoveryCatalog.tsx`
- Create: 8 use case components in `src/components/slides/use-cases/procurement/`

**Reference:** Read spec sections P3-01 through P3-08. Domain color: `#7c3aed`. Domain ID: `domain-13`.

Agent files:
1. `SupplierDiscoveryMatching.tsx` — P3-01
2. `SupplierPreQualScreener.tsx` — P3-02
3. `FinancialHealthAssessor.tsx` — P3-03
4. `SupplierDiversityTracker.tsx` — P3-04
5. `SupplierOnboardingOrchestrator.tsx` — P3-05
6. `CapabilityAssessmentAgent.tsx` — P3-06
7. `SupplierConsolidationAnalyzer.tsx` — P3-07
8. `BackgroundSanctionsScreener.tsx` — P3-08

- [ ] **Step 1: Create domain catalog**
- [ ] **Step 2: Create all 8 use case components**
- [ ] **Step 3: Verify compilation**
- [ ] **Step 4: Commit** — `"feat: add Domain 13 — Supplier Discovery & Qualification (8 agents)"`

---

## Task 6: Create Domain 14 — Contract Lifecycle Management (9 agents)

**Files:**
- Create: `src/components/slides/domains/ContractLifecycleCatalog.tsx`
- Create: 9 use case components in `src/components/slides/use-cases/procurement/`

**Reference:** Read spec sections P4-01 through P4-09. Domain color: `#dc2626`. Domain ID: `domain-14`.

Agent files:
1. `ContractAuthoringAgent.tsx` — P4-01
2. `ClauseRiskAnalyzer.tsx` — P4-02
3. `ObligationMiningTracking.tsx` — P4-03
4. `RenewalExpiryMonitor.tsx` — P4-04
5. `RedlineComparisonAgent.tsx` — P4-05
6. `ContractComplianceAuditor.tsx` — P4-06
7. `AgreementHierarchyTracker.tsx` — P4-07
8. `ContractAnalyticsDashboard.tsx` — P4-08
9. `ForceMajeureAdvisor.tsx` — P4-09

- [ ] **Step 1: Create domain catalog**
- [ ] **Step 2: Create all 9 use case components**
- [ ] **Step 3: Verify compilation**
- [ ] **Step 4: Commit** — `"feat: add Domain 14 — Contract Lifecycle Management (9 agents)"`

---

## Task 7: Create Domain 15 — Procure-to-Pay Operations (11 agents)

**Files:**
- Create: `src/components/slides/domains/ProcureToPayCatalog.tsx`
- Create: 11 use case components in `src/components/slides/use-cases/procurement/`

**Reference:** Read spec sections P5-01 through P5-11. Domain color: `#ca8a04`. Domain ID: `domain-15`.

Agent files:
1. `RequisitionIntakeRouting.tsx` — P5-01
2. `PurchaseOrderAutoGeneration.tsx` — P5-02
3. `ThreeWayMatchExceptionHandler.tsx` — P5-03
4. `InvoiceDataExtraction.tsx` — P5-04
5. `DuplicatePaymentDetector.tsx` — P5-05
6. `MaverickSpendDetectorNudge.tsx` — P5-06
7. `PaymentOptimizationAgent.tsx` — P5-07
8. `GoodsReceiptValidator.tsx` — P5-08
9. `P2PCycleTimeAnalyzer.tsx` — P5-09
10. `ApprovalWorkflowOptimizer.tsx` — P5-10
11. `PCardReconciliationAgent.tsx` — P5-11

- [ ] **Step 1: Create domain catalog**
- [ ] **Step 2: Create all 11 use case components**
- [ ] **Step 3: Verify compilation**
- [ ] **Step 4: Commit** — `"feat: add Domain 15 — Procure-to-Pay Operations (11 agents)"`

---

## Task 8: Create Domain 16 — Supplier Risk & Compliance (8 agents)

**Files:**
- Create: `src/components/slides/domains/SupplierRiskCatalog.tsx`
- Create: 8 use case components in `src/components/slides/use-cases/procurement/`

**Reference:** Read spec sections P6-01 through P6-08. Domain color: `#57534e`. Domain ID: `domain-16`.

Agent files:
1. `SupplierRiskScoringEngine.tsx` — P6-01
2. `SupplyChainDisruptionMonitor.tsx` — P6-02
3. `SanctionsWatchlistScreener.tsx` — P6-03
4. `RegulatoryComplianceTracker.tsx` — P6-04
5. `SubTierVisibilityAgent.tsx` — P6-05
6. `AuditCorrectiveActionTracker.tsx` — P6-06
7. `ConcentrationRiskAnalyzer.tsx` — P6-07
8. `InsuranceLiabilityMonitor.tsx` — P6-08

- [ ] **Step 1: Create domain catalog**
- [ ] **Step 2: Create all 8 use case components**
- [ ] **Step 3: Verify compilation**
- [ ] **Step 4: Commit** — `"feat: add Domain 16 — Supplier Risk & Compliance (8 agents)"`

---

## Task 9: Create Domain 17 — Supplier Performance & Relationship (7 agents)

**Files:**
- Create: `src/components/slides/domains/SupplierPerformanceCatalog.tsx`
- Create: 7 use case components in `src/components/slides/use-cases/procurement/`

**Reference:** Read spec sections P7-01 through P7-07. Domain color: `#db2777`. Domain ID: `domain-17`.

Agent files:
1. `SupplierScorecardGenerator.tsx` — P7-01
2. `QualityIncidentAnalyzer.tsx` — P7-02
3. `DeliveryPerformanceMonitor.tsx` — P7-03
4. `BusinessReviewPrepAgent.tsx` — P7-04
5. `SupplierDevelopmentPlanner.tsx` — P7-05
6. `RelationshipHealthAnalyzer.tsx` — P7-06
7. `InnovationValueEngTracker.tsx` — P7-07

- [ ] **Step 1: Create domain catalog**
- [ ] **Step 2: Create all 7 use case components**
- [ ] **Step 3: Verify compilation**
- [ ] **Step 4: Commit** — `"feat: add Domain 17 — Supplier Performance & Relationship (7 agents)"`

---

## Task 10: Create Domain 18 — Indirect & Tail Spend Management (6 agents)

**Files:**
- Create: `src/components/slides/domains/IndirectTailSpendCatalog.tsx`
- Create: 6 use case components in `src/components/slides/use-cases/procurement/`

**Reference:** Read spec sections P8-01 through P8-06. Domain color: `#4f46e5`. Domain ID: `domain-18`.

Agent files:
1. `TailSpendClassifier.tsx` — P8-01
2. `CatalogCurationRecommendation.tsx` — P8-02
3. `SpotBuyNegotiationAgent.tsx` — P8-03
4. `MROFacilitiesOptimization.tsx` — P8-04
5. `TravelExpenseComplianceAgent.tsx` — P8-05
6. `ServicesProcurementSOWManager.tsx` — P8-06

- [ ] **Step 1: Create domain catalog**
- [ ] **Step 2: Create all 6 use case components**
- [ ] **Step 3: Verify compilation**
- [ ] **Step 4: Commit** — `"feat: add Domain 18 — Indirect & Tail Spend Management (6 agents)"`

---

## Task 11: Create Domain 19 — Spend Analytics & Procurement Intelligence (10 agents)

**Files:**
- Create: `src/components/slides/domains/SpendAnalyticsCatalog.tsx`
- Create: 10 use case components in `src/components/slides/use-cases/procurement/`

**Reference:** Read spec sections P9-01 through P9-10. Domain color: `#0891b2`. Domain ID: `domain-19`.

Agent files:
1. `SpendCubeBuilderEnrichment.tsx` — P9-01
2. `SavingsRealizationTracker.tsx` — P9-02
3. `CommodityPriceForecaster.tsx` — P9-03
4. `ProcurementKPIDashboard.tsx` — P9-04
5. `TotalCostOwnershipModeler.tsx` — P9-05
6. `ProcurementValueReporter.tsx` — P9-06
7. `PriceVarianceAnalyzer.tsx` — P9-07
8. `DemandPatternAnalyzer.tsx` — P9-08
9. `BenchmarkIntelligenceAgent.tsx` — P9-09
10. `WhatIfScenarioSimulator.tsx` — P9-10

- [ ] **Step 1: Create domain catalog**
- [ ] **Step 2: Create all 10 use case components**
- [ ] **Step 3: Verify compilation**
- [ ] **Step 4: Commit** — `"feat: add Domain 19 — Spend Analytics & Intelligence (10 agents)"`

---

## Task 12: Wire All Procurement Slides into slides.tsx

**Files:**
- Modify: `src/config/slides.tsx`

- [ ] **Step 1: Add all imports**

Add after the Domain 10 use case imports (line 118):

```typescript
// ═══════════════════════════════════════════════
// PROCUREMENT DOMAINS (11-19)
// ═══════════════════════════════════════════════

// Domain Catalogs
import { ProcurementStrategyCatalog } from "../components/slides/domains/ProcurementStrategyCatalog";
import { StrategicSourcingCatalog } from "../components/slides/domains/StrategicSourcingCatalog";
import { SupplierDiscoveryCatalog } from "../components/slides/domains/SupplierDiscoveryCatalog";
import { ContractLifecycleCatalog } from "../components/slides/domains/ContractLifecycleCatalog";
import { ProcureToPayCatalog } from "../components/slides/domains/ProcureToPayCatalog";
import { SupplierRiskCatalog } from "../components/slides/domains/SupplierRiskCatalog";
import { SupplierPerformanceCatalog } from "../components/slides/domains/SupplierPerformanceCatalog";
import { IndirectTailSpendCatalog } from "../components/slides/domains/IndirectTailSpendCatalog";
import { SpendAnalyticsCatalog } from "../components/slides/domains/SpendAnalyticsCatalog";

// Domain 11 - Procurement Strategy & Demand Planning
import { CategoryStrategyGenerator } from "../components/slides/use-cases/procurement/CategoryStrategyGenerator";
import { DemandForecastingAggregation } from "../components/slides/use-cases/procurement/DemandForecastingAggregation";
import { MakeVsBuyAnalyzer } from "../components/slides/use-cases/procurement/MakeVsBuyAnalyzer";
import { ProcurementPolicyAssistant } from "../components/slides/use-cases/procurement/ProcurementPolicyAssistant";
import { SavingsPipelineTracker } from "../components/slides/use-cases/procurement/SavingsPipelineTracker";
import { ProcurementMaturityAssessor } from "../components/slides/use-cases/procurement/ProcurementMaturityAssessor";
import { StakeholderSatisfactionAnalyzer } from "../components/slides/use-cases/procurement/StakeholderSatisfactionAnalyzer";

// Domain 12 - Strategic Sourcing & Category Management
import { SpendClassificationEnrichment } from "../components/slides/use-cases/procurement/SpendClassificationEnrichment";
import { MarketIntelligenceMonitor } from "../components/slides/use-cases/procurement/MarketIntelligenceMonitor";
import { ShouldCostModeler } from "../components/slides/use-cases/procurement/ShouldCostModeler";
import { RFxBuilderOrchestrator } from "../components/slides/use-cases/procurement/RFxBuilderOrchestrator";
import { BidEvaluationAnalyzer } from "../components/slides/use-cases/procurement/BidEvaluationAnalyzer";
import { AuctionStrategyAdvisor } from "../components/slides/use-cases/procurement/AuctionStrategyAdvisor";
import { NegotiationPrepAgent } from "../components/slides/use-cases/procurement/NegotiationPrepAgent";
import { CategorySpendDashboard } from "../components/slides/use-cases/procurement/CategorySpendDashboard";
import { SoleSourceJustification } from "../components/slides/use-cases/procurement/SoleSourceJustification";
import { CategoryRoadmapPlanner } from "../components/slides/use-cases/procurement/CategoryRoadmapPlanner";
import { SpecStandardizationAgent } from "../components/slides/use-cases/procurement/SpecStandardizationAgent";
import { SourcingChannelOptimizer } from "../components/slides/use-cases/procurement/SourcingChannelOptimizer";

// Domain 13 - Supplier Discovery & Qualification
import { SupplierDiscoveryMatching } from "../components/slides/use-cases/procurement/SupplierDiscoveryMatching";
import { SupplierPreQualScreener } from "../components/slides/use-cases/procurement/SupplierPreQualScreener";
import { FinancialHealthAssessor } from "../components/slides/use-cases/procurement/FinancialHealthAssessor";
import { SupplierDiversityTracker } from "../components/slides/use-cases/procurement/SupplierDiversityTracker";
import { SupplierOnboardingOrchestrator } from "../components/slides/use-cases/procurement/SupplierOnboardingOrchestrator";
import { CapabilityAssessmentAgent } from "../components/slides/use-cases/procurement/CapabilityAssessmentAgent";
import { SupplierConsolidationAnalyzer } from "../components/slides/use-cases/procurement/SupplierConsolidationAnalyzer";
import { BackgroundSanctionsScreener } from "../components/slides/use-cases/procurement/BackgroundSanctionsScreener";

// Domain 14 - Contract Lifecycle Management
import { ContractAuthoringAgent } from "../components/slides/use-cases/procurement/ContractAuthoringAgent";
import { ClauseRiskAnalyzer } from "../components/slides/use-cases/procurement/ClauseRiskAnalyzer";
import { ObligationMiningTracking } from "../components/slides/use-cases/procurement/ObligationMiningTracking";
import { RenewalExpiryMonitor } from "../components/slides/use-cases/procurement/RenewalExpiryMonitor";
import { RedlineComparisonAgent } from "../components/slides/use-cases/procurement/RedlineComparisonAgent";
import { ContractComplianceAuditor } from "../components/slides/use-cases/procurement/ContractComplianceAuditor";
import { AgreementHierarchyTracker } from "../components/slides/use-cases/procurement/AgreementHierarchyTracker";
import { ContractAnalyticsDashboard } from "../components/slides/use-cases/procurement/ContractAnalyticsDashboard";
import { ForceMajeureAdvisor } from "../components/slides/use-cases/procurement/ForceMajeureAdvisor";

// Domain 15 - Procure-to-Pay Operations
import { RequisitionIntakeRouting } from "../components/slides/use-cases/procurement/RequisitionIntakeRouting";
import { PurchaseOrderAutoGeneration } from "../components/slides/use-cases/procurement/PurchaseOrderAutoGeneration";
import { ThreeWayMatchExceptionHandler } from "../components/slides/use-cases/procurement/ThreeWayMatchExceptionHandler";
import { InvoiceDataExtraction } from "../components/slides/use-cases/procurement/InvoiceDataExtraction";
import { DuplicatePaymentDetector } from "../components/slides/use-cases/procurement/DuplicatePaymentDetector";
import { MaverickSpendDetectorNudge } from "../components/slides/use-cases/procurement/MaverickSpendDetectorNudge";
import { PaymentOptimizationAgent } from "../components/slides/use-cases/procurement/PaymentOptimizationAgent";
import { GoodsReceiptValidator } from "../components/slides/use-cases/procurement/GoodsReceiptValidator";
import { P2PCycleTimeAnalyzer } from "../components/slides/use-cases/procurement/P2PCycleTimeAnalyzer";
import { ApprovalWorkflowOptimizer } from "../components/slides/use-cases/procurement/ApprovalWorkflowOptimizer";
import { PCardReconciliationAgent } from "../components/slides/use-cases/procurement/PCardReconciliationAgent";

// Domain 16 - Supplier Risk & Compliance
import { SupplierRiskScoringEngine } from "../components/slides/use-cases/procurement/SupplierRiskScoringEngine";
import { SupplyChainDisruptionMonitor } from "../components/slides/use-cases/procurement/SupplyChainDisruptionMonitor";
import { SanctionsWatchlistScreener } from "../components/slides/use-cases/procurement/SanctionsWatchlistScreener";
import { RegulatoryComplianceTracker } from "../components/slides/use-cases/procurement/RegulatoryComplianceTracker";
import { SubTierVisibilityAgent } from "../components/slides/use-cases/procurement/SubTierVisibilityAgent";
import { AuditCorrectiveActionTracker } from "../components/slides/use-cases/procurement/AuditCorrectiveActionTracker";
import { ConcentrationRiskAnalyzer } from "../components/slides/use-cases/procurement/ConcentrationRiskAnalyzer";
import { InsuranceLiabilityMonitor } from "../components/slides/use-cases/procurement/InsuranceLiabilityMonitor";

// Domain 17 - Supplier Performance & Relationship
import { SupplierScorecardGenerator } from "../components/slides/use-cases/procurement/SupplierScorecardGenerator";
import { QualityIncidentAnalyzer } from "../components/slides/use-cases/procurement/QualityIncidentAnalyzer";
import { DeliveryPerformanceMonitor } from "../components/slides/use-cases/procurement/DeliveryPerformanceMonitor";
import { BusinessReviewPrepAgent } from "../components/slides/use-cases/procurement/BusinessReviewPrepAgent";
import { SupplierDevelopmentPlanner } from "../components/slides/use-cases/procurement/SupplierDevelopmentPlanner";
import { RelationshipHealthAnalyzer } from "../components/slides/use-cases/procurement/RelationshipHealthAnalyzer";
import { InnovationValueEngTracker } from "../components/slides/use-cases/procurement/InnovationValueEngTracker";

// Domain 18 - Indirect & Tail Spend
import { TailSpendClassifier } from "../components/slides/use-cases/procurement/TailSpendClassifier";
import { CatalogCurationRecommendation } from "../components/slides/use-cases/procurement/CatalogCurationRecommendation";
import { SpotBuyNegotiationAgent } from "../components/slides/use-cases/procurement/SpotBuyNegotiationAgent";
import { MROFacilitiesOptimization } from "../components/slides/use-cases/procurement/MROFacilitiesOptimization";
import { TravelExpenseComplianceAgent } from "../components/slides/use-cases/procurement/TravelExpenseComplianceAgent";
import { ServicesProcurementSOWManager } from "../components/slides/use-cases/procurement/ServicesProcurementSOWManager";

// Domain 19 - Spend Analytics & Procurement Intelligence
import { SpendCubeBuilderEnrichment } from "../components/slides/use-cases/procurement/SpendCubeBuilderEnrichment";
import { SavingsRealizationTracker } from "../components/slides/use-cases/procurement/SavingsRealizationTracker";
import { CommodityPriceForecaster } from "../components/slides/use-cases/procurement/CommodityPriceForecaster";
import { ProcurementKPIDashboard } from "../components/slides/use-cases/procurement/ProcurementKPIDashboard";
import { TotalCostOwnershipModeler } from "../components/slides/use-cases/procurement/TotalCostOwnershipModeler";
import { ProcurementValueReporter } from "../components/slides/use-cases/procurement/ProcurementValueReporter";
import { PriceVarianceAnalyzer } from "../components/slides/use-cases/procurement/PriceVarianceAnalyzer";
import { DemandPatternAnalyzer } from "../components/slides/use-cases/procurement/DemandPatternAnalyzer";
import { BenchmarkIntelligenceAgent } from "../components/slides/use-cases/procurement/BenchmarkIntelligenceAgent";
import { WhatIfScenarioSimulator } from "../components/slides/use-cases/procurement/WhatIfScenarioSimulator";
```

- [ ] **Step 2: Add all Procurement slide configs to SLIDES array**

Add after the Domain 10 entries (after line 312), before the ACT VI section divider:

```typescript
  // ═══════════════════════════════════════════════════════
  // PROCUREMENT — 78 AGENTS ACROSS 9 DOMAINS
  // ═══════════════════════════════════════════════════════

  // Domain 11 - Procurement Strategy & Demand Planning (7 agents)
  { id: "domain-11", title: "Procurement Strategy Catalog", content: <ProcurementStrategyCatalog />, level: 2, parent: "domain-map", domain: 11 },
  { id: "uc-1101", title: "Category Strategy Generator", content: <CategoryStrategyGenerator />, level: 3, parent: "domain-11", domain: 11 },
  { id: "uc-1102", title: "Demand Forecasting & Aggregation", content: <DemandForecastingAggregation />, level: 3, parent: "domain-11", domain: 11 },
  { id: "uc-1103", title: "Make-vs-Buy Analyzer", content: <MakeVsBuyAnalyzer />, level: 3, parent: "domain-11", domain: 11 },
  { id: "uc-1104", title: "Procurement Policy Assistant", content: <ProcurementPolicyAssistant />, level: 3, parent: "domain-11", domain: 11 },
  { id: "uc-1105", title: "Savings Pipeline Tracker", content: <SavingsPipelineTracker />, level: 3, parent: "domain-11", domain: 11 },
  { id: "uc-1106", title: "Procurement Maturity Assessor", content: <ProcurementMaturityAssessor />, level: 3, parent: "domain-11", domain: 11 },
  { id: "uc-1107", title: "Stakeholder Satisfaction Analyzer", content: <StakeholderSatisfactionAnalyzer />, level: 3, parent: "domain-11", domain: 11 },

  // Domain 12 - Strategic Sourcing & Category Management (12 agents)
  { id: "domain-12", title: "Strategic Sourcing Catalog", content: <StrategicSourcingCatalog />, level: 2, parent: "domain-map", domain: 12 },
  { id: "uc-1201", title: "Spend Classification & Enrichment", content: <SpendClassificationEnrichment />, level: 3, parent: "domain-12", domain: 12 },
  { id: "uc-1202", title: "Market Intelligence Monitor", content: <MarketIntelligenceMonitor />, level: 3, parent: "domain-12", domain: 12 },
  { id: "uc-1203", title: "Should-Cost Modeler", content: <ShouldCostModeler />, level: 3, parent: "domain-12", domain: 12 },
  { id: "uc-1204", title: "RFx Builder & Orchestrator", content: <RFxBuilderOrchestrator />, level: 3, parent: "domain-12", domain: 12 },
  { id: "uc-1205", title: "Bid Evaluation & Scenario Analyzer", content: <BidEvaluationAnalyzer />, level: 3, parent: "domain-12", domain: 12 },
  { id: "uc-1206", title: "Auction Strategy Advisor", content: <AuctionStrategyAdvisor />, level: 3, parent: "domain-12", domain: 12 },
  { id: "uc-1207", title: "Negotiation Prep Agent", content: <NegotiationPrepAgent />, level: 3, parent: "domain-12", domain: 12 },
  { id: "uc-1208", title: "Category Spend Dashboard", content: <CategorySpendDashboard />, level: 3, parent: "domain-12", domain: 12 },
  { id: "uc-1209", title: "Sole/Single Source Justification", content: <SoleSourceJustification />, level: 3, parent: "domain-12", domain: 12 },
  { id: "uc-1210", title: "Category Roadmap Planner", content: <CategoryRoadmapPlanner />, level: 3, parent: "domain-12", domain: 12 },
  { id: "uc-1211", title: "Specification Standardization", content: <SpecStandardizationAgent />, level: 3, parent: "domain-12", domain: 12 },
  { id: "uc-1212", title: "Sourcing Channel Optimizer", content: <SourcingChannelOptimizer />, level: 3, parent: "domain-12", domain: 12 },

  // Domain 13 - Supplier Discovery & Qualification (8 agents)
  { id: "domain-13", title: "Supplier Discovery Catalog", content: <SupplierDiscoveryCatalog />, level: 2, parent: "domain-map", domain: 13 },
  { id: "uc-1301", title: "Supplier Discovery & Matching", content: <SupplierDiscoveryMatching />, level: 3, parent: "domain-13", domain: 13 },
  { id: "uc-1302", title: "Supplier Pre-Qualification Screener", content: <SupplierPreQualScreener />, level: 3, parent: "domain-13", domain: 13 },
  { id: "uc-1303", title: "Financial Health Assessor", content: <FinancialHealthAssessor />, level: 3, parent: "domain-13", domain: 13 },
  { id: "uc-1304", title: "Supplier Diversity Tracker", content: <SupplierDiversityTracker />, level: 3, parent: "domain-13", domain: 13 },
  { id: "uc-1305", title: "Supplier Onboarding Orchestrator", content: <SupplierOnboardingOrchestrator />, level: 3, parent: "domain-13", domain: 13 },
  { id: "uc-1306", title: "Capability Assessment Agent", content: <CapabilityAssessmentAgent />, level: 3, parent: "domain-13", domain: 13 },
  { id: "uc-1307", title: "Supplier Consolidation Analyzer", content: <SupplierConsolidationAnalyzer />, level: 3, parent: "domain-13", domain: 13 },
  { id: "uc-1308", title: "Background & Sanctions Screener", content: <BackgroundSanctionsScreener />, level: 3, parent: "domain-13", domain: 13 },

  // Domain 14 - Contract Lifecycle Management (9 agents)
  { id: "domain-14", title: "Contract Lifecycle Catalog", content: <ContractLifecycleCatalog />, level: 2, parent: "domain-map", domain: 14 },
  { id: "uc-1401", title: "Contract Authoring Agent", content: <ContractAuthoringAgent />, level: 3, parent: "domain-14", domain: 14 },
  { id: "uc-1402", title: "Clause Risk Analyzer", content: <ClauseRiskAnalyzer />, level: 3, parent: "domain-14", domain: 14 },
  { id: "uc-1403", title: "Obligation Mining & Tracking", content: <ObligationMiningTracking />, level: 3, parent: "domain-14", domain: 14 },
  { id: "uc-1404", title: "Renewal & Expiry Monitor", content: <RenewalExpiryMonitor />, level: 3, parent: "domain-14", domain: 14 },
  { id: "uc-1405", title: "Redline Comparison Agent", content: <RedlineComparisonAgent />, level: 3, parent: "domain-14", domain: 14 },
  { id: "uc-1406", title: "Contract Compliance Auditor", content: <ContractComplianceAuditor />, level: 3, parent: "domain-14", domain: 14 },
  { id: "uc-1407", title: "Agreement Hierarchy Tracker", content: <AgreementHierarchyTracker />, level: 3, parent: "domain-14", domain: 14 },
  { id: "uc-1408", title: "Contract Analytics Dashboard", content: <ContractAnalyticsDashboard />, level: 3, parent: "domain-14", domain: 14 },
  { id: "uc-1409", title: "Force Majeure & Termination Advisor", content: <ForceMajeureAdvisor />, level: 3, parent: "domain-14", domain: 14 },

  // Domain 15 - Procure-to-Pay Operations (11 agents)
  { id: "domain-15", title: "Procure-to-Pay Catalog", content: <ProcureToPayCatalog />, level: 2, parent: "domain-map", domain: 15 },
  { id: "uc-1501", title: "Requisition Intake & Smart Routing", content: <RequisitionIntakeRouting />, level: 3, parent: "domain-15", domain: 15 },
  { id: "uc-1502", title: "Purchase Order Auto-Generation", content: <PurchaseOrderAutoGeneration />, level: 3, parent: "domain-15", domain: 15 },
  { id: "uc-1503", title: "Three-Way Match & Exception Handler", content: <ThreeWayMatchExceptionHandler />, level: 3, parent: "domain-15", domain: 15 },
  { id: "uc-1504", title: "Invoice Data Extraction", content: <InvoiceDataExtraction />, level: 3, parent: "domain-15", domain: 15 },
  { id: "uc-1505", title: "Duplicate Payment Detector", content: <DuplicatePaymentDetector />, level: 3, parent: "domain-15", domain: 15 },
  { id: "uc-1506", title: "Maverick Spend Detector & Nudge", content: <MaverickSpendDetectorNudge />, level: 3, parent: "domain-15", domain: 15 },
  { id: "uc-1507", title: "Payment Optimization Agent", content: <PaymentOptimizationAgent />, level: 3, parent: "domain-15", domain: 15 },
  { id: "uc-1508", title: "Goods Receipt & Service Entry Validator", content: <GoodsReceiptValidator />, level: 3, parent: "domain-15", domain: 15 },
  { id: "uc-1509", title: "P2P Cycle Time Analyzer", content: <P2PCycleTimeAnalyzer />, level: 3, parent: "domain-15", domain: 15 },
  { id: "uc-1510", title: "Approval Workflow Optimizer", content: <ApprovalWorkflowOptimizer />, level: 3, parent: "domain-15", domain: 15 },
  { id: "uc-1511", title: "P-Card Reconciliation Agent", content: <PCardReconciliationAgent />, level: 3, parent: "domain-15", domain: 15 },

  // Domain 16 - Supplier Risk & Compliance (8 agents)
  { id: "domain-16", title: "Supplier Risk Catalog", content: <SupplierRiskCatalog />, level: 2, parent: "domain-map", domain: 16 },
  { id: "uc-1601", title: "Supplier Risk Scoring Engine", content: <SupplierRiskScoringEngine />, level: 3, parent: "domain-16", domain: 16 },
  { id: "uc-1602", title: "Supply Chain Disruption Monitor", content: <SupplyChainDisruptionMonitor />, level: 3, parent: "domain-16", domain: 16 },
  { id: "uc-1603", title: "Sanctions & Watchlist Screener", content: <SanctionsWatchlistScreener />, level: 3, parent: "domain-16", domain: 16 },
  { id: "uc-1604", title: "Regulatory Compliance Tracker", content: <RegulatoryComplianceTracker />, level: 3, parent: "domain-16", domain: 16 },
  { id: "uc-1605", title: "Sub-Tier Visibility Agent", content: <SubTierVisibilityAgent />, level: 3, parent: "domain-16", domain: 16 },
  { id: "uc-1606", title: "Audit & Corrective Action Tracker", content: <AuditCorrectiveActionTracker />, level: 3, parent: "domain-16", domain: 16 },
  { id: "uc-1607", title: "Concentration Risk Analyzer", content: <ConcentrationRiskAnalyzer />, level: 3, parent: "domain-16", domain: 16 },
  { id: "uc-1608", title: "Insurance & Liability Monitor", content: <InsuranceLiabilityMonitor />, level: 3, parent: "domain-16", domain: 16 },

  // Domain 17 - Supplier Performance & Relationship (7 agents)
  { id: "domain-17", title: "Supplier Performance Catalog", content: <SupplierPerformanceCatalog />, level: 2, parent: "domain-map", domain: 17 },
  { id: "uc-1701", title: "Supplier Scorecard Generator", content: <SupplierScorecardGenerator />, level: 3, parent: "domain-17", domain: 17 },
  { id: "uc-1702", title: "Quality Incident Analyzer", content: <QualityIncidentAnalyzer />, level: 3, parent: "domain-17", domain: 17 },
  { id: "uc-1703", title: "Delivery Performance Monitor", content: <DeliveryPerformanceMonitor />, level: 3, parent: "domain-17", domain: 17 },
  { id: "uc-1704", title: "Business Review Prep Agent", content: <BusinessReviewPrepAgent />, level: 3, parent: "domain-17", domain: 17 },
  { id: "uc-1705", title: "Supplier Development Planner", content: <SupplierDevelopmentPlanner />, level: 3, parent: "domain-17", domain: 17 },
  { id: "uc-1706", title: "Relationship Health Analyzer", content: <RelationshipHealthAnalyzer />, level: 3, parent: "domain-17", domain: 17 },
  { id: "uc-1707", title: "Innovation & Value Engineering Tracker", content: <InnovationValueEngTracker />, level: 3, parent: "domain-17", domain: 17 },

  // Domain 18 - Indirect & Tail Spend Management (6 agents)
  { id: "domain-18", title: "Indirect & Tail Spend Catalog", content: <IndirectTailSpendCatalog />, level: 2, parent: "domain-map", domain: 18 },
  { id: "uc-1801", title: "Tail Spend Classifier & Opportunity Finder", content: <TailSpendClassifier />, level: 3, parent: "domain-18", domain: 18 },
  { id: "uc-1802", title: "Catalog Curation & Recommendation", content: <CatalogCurationRecommendation />, level: 3, parent: "domain-18", domain: 18 },
  { id: "uc-1803", title: "Spot Buy Negotiation Agent", content: <SpotBuyNegotiationAgent />, level: 3, parent: "domain-18", domain: 18 },
  { id: "uc-1804", title: "MRO & Facilities Optimization", content: <MROFacilitiesOptimization />, level: 3, parent: "domain-18", domain: 18 },
  { id: "uc-1805", title: "Travel & Expense Compliance Agent", content: <TravelExpenseComplianceAgent />, level: 3, parent: "domain-18", domain: 18 },
  { id: "uc-1806", title: "Services Procurement & SOW Manager", content: <ServicesProcurementSOWManager />, level: 3, parent: "domain-18", domain: 18 },

  // Domain 19 - Spend Analytics & Procurement Intelligence (10 agents)
  { id: "domain-19", title: "Spend Analytics Catalog", content: <SpendAnalyticsCatalog />, level: 2, parent: "domain-map", domain: 19 },
  { id: "uc-1901", title: "Spend Cube Builder & Enrichment", content: <SpendCubeBuilderEnrichment />, level: 3, parent: "domain-19", domain: 19 },
  { id: "uc-1902", title: "Savings Realization Tracker", content: <SavingsRealizationTracker />, level: 3, parent: "domain-19", domain: 19 },
  { id: "uc-1903", title: "Commodity Price Forecaster", content: <CommodityPriceForecaster />, level: 3, parent: "domain-19", domain: 19 },
  { id: "uc-1904", title: "Procurement KPI Dashboard", content: <ProcurementKPIDashboard />, level: 3, parent: "domain-19", domain: 19 },
  { id: "uc-1905", title: "Total Cost of Ownership Modeler", content: <TotalCostOwnershipModeler />, level: 3, parent: "domain-19", domain: 19 },
  { id: "uc-1906", title: "Procurement Value Reporter", content: <ProcurementValueReporter />, level: 3, parent: "domain-19", domain: 19 },
  { id: "uc-1907", title: "Price Variance Analyzer", content: <PriceVarianceAnalyzer />, level: 3, parent: "domain-19", domain: 19 },
  { id: "uc-1908", title: "Demand Pattern Analyzer", content: <DemandPatternAnalyzer />, level: 3, parent: "domain-19", domain: 19 },
  { id: "uc-1909", title: "Benchmark Intelligence Agent", content: <BenchmarkIntelligenceAgent />, level: 3, parent: "domain-19", domain: 19 },
  { id: "uc-1910", title: "What-If Scenario Simulator", content: <WhatIfScenarioSimulator />, level: 3, parent: "domain-19", domain: 19 },
```

- [ ] **Step 3: Update the Periodic Table title and count**

The PeriodicTableSlide auto-renders from the AGENTS array — no changes needed. But update the ACT V section divider title from "82 Agents. 10 Domains." to "160 Agents. 19 Domains.":

In `src/config/slides.tsx`, find the act-5 entry and update:

```typescript
{ id: "act-5", title: "The Map", content: <SectionDividerSlide sectionNumber="IV" title="160 Agents. 19 Domains." subtitle="The complete periodic table of enterprise agentic capabilities — HR and Procurement. Click any element to explore." quote="You can't automate what you don't understand. Start with the people, map the processes, then build the agents." icon={Map} accentColor="#10b981" />, level: 0 },
```

- [ ] **Step 4: Verify the full app compiles**

Run: `cd /home/user/fde-agent-factory && npm run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/config/slides.tsx
git commit -m "feat: wire 78 Procurement agents and 9 domain catalogs into slide config"
```

---

## Task 13: Verify End-to-End

- [ ] **Step 1: Start the dev server**

Run: `cd /home/user/fde-agent-factory && npm run dev`

- [ ] **Step 2: Verify in browser**

Check the following:
1. Periodic table shows 19 domains with Procurement agents in domain colors
2. Click any Procurement agent element — navigates to use case detail
3. Click "Back" on use case — navigates to domain catalog
4. Domain catalog shows all agents for that domain with correct icons and descriptions
5. Breadcrumbs show: Story > Map > [Domain] > [Agent]
6. Arrow key navigation works within Procurement use cases
7. All 3 tabs (Overview, Agent Workflow, Systems & Impact) render correctly

- [ ] **Step 3: Final commit if any fixes needed**

---

## Parallelization Guide

**Tasks 1-2** (infrastructure) must run first — they're sequential prerequisites.

**Tasks 3-11** (domain creation) can run in parallel — each domain is independent. This is ideal for subagent-driven development with 9 parallel subagents.

**Task 12** (wiring) must run after all domain tasks complete.

**Task 13** (verification) runs last.

```
Tasks 1-2 (sequential)
    │
    ├── Task 3  (Domain 11 - 7 agents)  ─┐
    ├── Task 4  (Domain 12 - 12 agents) ─┤
    ├── Task 5  (Domain 13 - 8 agents)  ─┤
    ├── Task 6  (Domain 14 - 9 agents)  ─┤
    ├── Task 7  (Domain 15 - 11 agents) ─┤── All parallel
    ├── Task 8  (Domain 16 - 8 agents)  ─┤
    ├── Task 9  (Domain 17 - 7 agents)  ─┤
    ├── Task 10 (Domain 18 - 6 agents)  ─┤
    └── Task 11 (Domain 19 - 10 agents) ─┘
                    │
               Task 12 (wiring)
                    │
               Task 13 (verify)
```
