# Use-Case Spec Enrichment Instructions

## Goal

Enrich TSX slide files under `src/components/slides/use-cases/<dept>/` with **explicit, production-grade** `generationSpec` (typed `UseCaseGenerationSpec`) and nested `behaviorContract` (typed `AgentBehaviorContract`). Each enriched slide should pass the current spec audit at `apps/ge-demo-generator/scripts/audit-usecase-specs.mjs`; generated workspace specs should pass `skills/interviewing-specs/scripts/validate-usecase-spec.mjs`.

## Required reading before editing

1. Gold reference pattern: `/home/user/fde-agent-factory/src/components/slides/use-cases/hr/BenefitsAssistant.tsx` (449 lines). Read fully. Mirror its **structure** — do NOT copy HR/benefits language.
2. Type definitions: `/home/user/fde-agent-factory/src/types/architecture.ts` — `UseCaseGenerationSpec`, `AgentBehaviorContract`, `AgentToolIntentSpec`, `AgentEvidenceRequirementSpec`, `AgentEscalationRuleSpec`, `AgentGoldenEvalSpec`.

## How the sync sees your spec

`apps/ge-demo-generator/scripts/sync-use-cases-from-slides.mjs` calls `evalSlideConst(source, "generationSpec")`. So at slide-module top level you need:

```tsx
const behaviorContract: AgentBehaviorContract = { ... };
const generationSpec: UseCaseGenerationSpec = { ..., behaviorContract, ... };
```

`behaviorContract` MUST be referenced by shorthand inside `generationSpec` (the sync evaluator handles sibling const bindings).

You do NOT need to wire any new prop on the UseCaseSlide component. The sync reads the const literal directly from the file source.

Imports to add (if not already present):
```ts
import type { UseCaseGenerationSpec, AgentBehaviorContract } from "../../../../types/architecture";
```
(check existing import for the right relative depth — most files are 4 levels deep under `src/`)

## Quality bar (every spec must pass)

### behaviorContract
- `role`: ≥20 chars, domain-specific (e.g. "AP Aging analyst that triages aged invoices and unblocks DSO improvements")
- `primaryObjective`: ≥60 chars, describes the real workflow outcome
- `toolIntents`: ≥3 total, with at least:
  - ≥1 `kind: "query"` (read source-system data)
  - ≥1 `kind: "evidence_lookup"` (cite a document) — **REQUIRED if `documents` array is non-empty**
  - ≥1 `kind: "action"` if the agent mutates external state (publishes, files, sends, deletes)
  - Each intent: `name` (canonical), `sourceSystemId` (must exist in `generationSpec.sourceSystems`), `description`, `requiredInputs`, `produces`, `evidenceEmitted`
- `evidenceRequirements`: ≥1, each with `claim`, `mustCite`, `sourceSystemIds`
- `escalationRules`: ≥2 with `trigger`, `action` (one of `escalate_to_human`/`refuse`/`request_more_info`/`use_fallback_tool`), `rationale`
- `refusalRules`: ≥3 short strings
- `goldenEvals`: ≥1, each with `id`, `prompt`, `expectedToolCalls`, `mustReferenceEntities`, `mustCiteDocuments`, `expectedActionOutcome`, `forbiddenBehaviors`

### generationSpec
- `version: 1`
- `rowPolicy`: `{ defaultRowsPerEntity: 50, minimumRowsPerEntity: 25, seed: 42, rationale: "..." }` (rationale = why the row counts are realistic for this workflow)
- `sourceSystems`: ≥3, derived from the slide's `systems` prop (skip Vertex AI / Gemini — they are model providers, not data sources). Each system: `{ id (snake_case), name, owns: [entity names], protocol, localBacking: [datastore], toolNames: [tool names], evidence: [evidence kinds] }`
- `entities`: ≥3, each with `sourceSystemId` (must exist in `sourceSystems`), `datastore` (alloydb/bigquery/firestore/cloud-storage), `rowCount` ≥25 for transactional, ≥10 acceptable for reference/lookup tables (but the validator floor is 25 — match it), `primaryKey: "id"`, `columns` with proper types.
- `relationships`: define foreign keys with `{ from, to, cardinality, orphanPolicy }`
- `documents`: ≥1 with **domain-specific** `requiredSections` (e.g. `["AP aging buckets", "Escalation rules", "Vendor exception list"]`, NOT `["Overview", "Workflow", "Audit"]`) and **domain-specific** `citationAnchors`
- `apis`: optional — include when the agent calls external write APIs not modeled as actions
- `anomalies`: ≥1 with `description`, `affectedEntities`, `discoveryPath`, `expectedEvidence`, `expectedRecommendation`
- `datastorePackaging`: `{ alloydb, bigquery, cloudStorage, apis }` blocks naming the database/dataset/bucket/service
- `validation`: `{ smokePrompt, expectedAnswer, assertions }`

### Tool naming convention (HARD requirement)
- Queries: `query_{systemId}_{entityOrIntent}` — e.g. `query_sap_s4hana_invoices`, `query_servicenow_tickets`
- Actions: `action_{systemId}_{verb}` — e.g. `action_coupa_release_hold`, `action_servicenow_create_incident`
- Lookups: `lookup_{document_id_snake}` — e.g. `lookup_ap_policy_handbook`
- NEVER use generic names: `query_mock_*`, `list_mock_*`, `query_records`, etc.

## Common pitfalls (caught in round 1)

1. **Float vs number type**: A column with fractional bounds (e.g. `min: 0.4, max: 1.0`) MUST use `type: "float"` with `decimals: 2`. `type: "number"` is integer-only and the faker will throw "No suitable integer value between X and Y found."
2. **Row count floor**: Validator fails if any entity has `rowCount < 25`. For periodic reports (weekly/monthly), bump to 25–30, not 12.
3. **evidence_lookup parity**: If you list any `documents`, you MUST have at least one `kind: "evidence_lookup"` toolIntent that references those documents in its description and emits `document_reference` evidence.
4. **Behavior text must be domain-specific**: Do not copy phrases like "benefit plan" or "carrier sync" into a finance/IT/marketing/procurement agent. Read the slide's `kpis`, `statusQuo`, and `agentification` arrays to ground the language.
5. **Source-system ID consistency**: `behaviorContract.toolIntents[*].sourceSystemId` must match an ID in `generationSpec.sourceSystems` exactly. The downstream validator fails the spec otherwise.
6. **Datastore enum**: only use `alloydb` | `bigquery` | `firestore` | `bigtable` | `cloud-storage` | `json-api` | `mcp`. AlloyDB for OLTP rows, BigQuery for analytics/historical, Cloud Storage for documents, JSON-API for system-of-record adapters.

## Per-file workflow

For each target file:

1. **Read** the existing TSX to capture:
   - `title`, `subtitle`, `persona`, `triggerType`, `domainId`, `systems` prop
   - `kpis` array (before → after) — informs the workflow outcome
   - `statusQuo` (what's broken today)
   - `agentification` (how the agent fixes it)
   - existing `architecture.connections` and `architecture.pipeline`
2. **Design** the spec:
   - Map each non-Vertex system to a `sourceSystem` entry
   - Identify ≥3 transactional entities (50 rows default) + ≥1 reference/lookup entity
   - Identify ≥1 governing document (policy / handbook / runbook / methodology) with domain-specific sections
   - Identify the workflow's main action (publish / file / escalate / remediate / send)
   - Identify the workflow's evidence claims and what they must cite
   - Identify 2-4 escalation triggers grounded in the KPIs
3. **Edit** the file:
   - Add `UseCaseGenerationSpec` and `AgentBehaviorContract` to imports if missing
   - Insert `const behaviorContract: AgentBehaviorContract = { ... };` and `const generationSpec: UseCaseGenerationSpec = { ..., behaviorContract, ... };` above the slide component function
   - Do NOT modify the existing slide JSX, props, copy, or visual content — only add the const declarations
4. **Verify** the sync evaluator can parse: a quick `grep "const generationSpec" <file>` confirms the const exists. No need to run the sync per file; do it once at the end.

## End-of-batch step

After all 10 files are enriched:

```bash
cd /home/user/fde-agent-factory
node apps/ge-demo-generator/scripts/sync-use-cases-from-slides.mjs
node apps/ge-demo-generator/scripts/audit-usecase-specs.mjs 2>&1 | tail -10
```

Report:
- File count attempted vs succeeded
- Any TSX that failed to parse (sync would warn `Could not parse generationSpec`)
- Final audit's `{explicit_production_spec, explicit_but_weak_spec, synthesized_only}` counts
- Any specific files left in `explicit_but_weak_spec` (the audit's `topWeakest` array shows gaps)

## Forbidden behaviors

- Do NOT modify any TSX outside the `const behaviorContract` / `const generationSpec` declarations and the import line
- Do NOT change the existing slide's `title`, `subtitle`, `persona`, `kpis`, `statusQuo`, `agentification`, or `architecture` content
- Do NOT use generic mock tool names
- Do NOT use `type: "number"` for fractional bounds (use `type: "float"` with `decimals`)
- Do NOT set any `rowCount` below 25
- Do NOT cite documents without an `evidence_lookup` toolIntent
- Do NOT copy HR/benefits domain language into non-HR specs
