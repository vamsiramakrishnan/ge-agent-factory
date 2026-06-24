# Generation Brief Contract

Write the brief in Markdown with these headings. Every section must be
specific enough that a coding agent can generate files without asking
another requirements question.

```markdown
# Agent Generation Brief

## Decision
- Department:
- Use case:
- Source slide:
- Persona:
- Audience:

## Workflow
- Trigger:
- Moment:
- User asks:
- Agent returns:
- Happy path steps:
- Exception path steps:
- Human approval points:

## Source Systems
- System:
  - Canonical ID:
  - Why it matters:
  - Owned entities:
  - Protocol/API shape:
  - Local backing: (AlloyDB / Firestore / Bigtable / BigQuery / Cloud Storage / JSON-backed API)
  - ADK tool names:
  - MCP tool names:
  - Auth boundary for live mode:

## Evidence
- Evidence artifact:
- Citation behavior:
- Audit trail:
- Minimum citation set:
  - SQL-like result:
  - Source-system record:
  - Document reference:
  - Generated audit trail:

## Data Specification

### Volume
- Rows per entity: (25 / 50 / 200 / custom)
- Reason for volume:
- Reference tables:
- Transaction tables:
- Analytical tables:
- Seed: (integer for deterministic generation)

### Entities & Schemas
For each entity, specify columns with types:
- Entity: employees
  - Source system: Workday
  - Datastore class: OLTP SQL
  - Primary key: id
  - Row count: 50
  - id: seq (EMP-{n:4})
  - name: person.fullName
  - department: enum [HR, Finance, IT] weights [0.4, 0.3, 0.3]
  - salary: number 55000-180000
  - hire_date: date 2019-01-01 to 2026-01-01

### API Contracts
For each API-backed source system:
- API:
- Operation:
- Request schema:
- Response schema:
- Error cases:
- JSON fixture file:
- MCP exposure:

### Distributions
- Which fields have skewed distributions (not uniform)?
- Example: status: enum [active, inactive, on_leave] weights [0.8, 0.1, 0.1]

### Relationships
- employees.id ← benefits.employee_id (foreign key)
- vendors.id ← purchase_orders.vendor_id
- Cardinality:
- Cascade/validity rule:
- Orphan policy: (must be zero unless anomaly intentionally seeds orphans)

### Anomalies (at least one required)
- Anomaly ID:
- Description: (what the agent should discover)
- Affected entities:
- Discovery path: (steps the agent takes to find it)
- Expected evidence:
- Expected fix/recommendation:

### Documents
- Document ID:
- Type: (policy / report / sop / contract / knowledge_base / audit / memo)
- Title:
- Topic: (keywords for content generation)
- Required sections:
- Named entities to cite:
- Minimum word count:
- Linked entities: (which tables the document references)
- Citation anchors:

If documents are skipped, auto-generate domain defaults (5 docs).

### Datastore Packaging
- OLTP SQL target: (AlloyDB database/schema)
- NoSQL document target: (Firestore database/collections)
- Wide-column/event target: (Bigtable instance/tables)
- OLAP target: (BigQuery dataset/tables)
- Blob target: (Cloud Storage bucket/prefix)
- API target: (Cloud Run/API Gateway/MCP server plan)

## Behavior Contract
Required. The factory uses this to write the agent's instruction, the
action/notification/evidence tool functions, and the golden eval set.
Without it, the generator emits a hello-world agent and `ge validate` will
fail on the `behavior:*` and `agent:contract_*` checks. See
`apps/ge-demo-generator/.gemini/skills/ge-foolproof-adk-agent-builder/references/behavior-contract.md`
for the full shape and validator mapping.

- Role: (e.g. "Benefits enrollment copilot for active GE employees in Workday" — ≥20 chars)
- Primary objective: (single-sentence success criterion that names the action surface — ≥60 chars)
- In scope: (bullet list of supported workflows)
- Out of scope: (bullet list of explicit refusals)
- Tool intents: (≥3, with at least one of kind `action` / `notification` / `evidence_lookup` / `calculation`)
  - For each intent: `name` (canonical, e.g. `submit_benefits_enrollment`), `kind`, `sourceSystemId` (must match a declared source system), `description` (domain-specific), `requiredInputs`, `produces`, `evidenceEmitted`.
- Evidence requirements: (≥1, each with `claim`, `mustCite` entity columns / document anchors, `sourceSystemIds`)
- Escalation rules: (≥1, each with `trigger`, `action` ∈ {escalate_to_human, refuse, request_more_info, use_fallback_tool}, optional `handoffTarget`, `rationale`)
- Refusal rules: (≥1 hard guardrail — PII, invention, compliance)
- Golden evals: (≥1, each with `id`, `prompt`, `expectedToolCalls` that all resolve to declared tool intent names, optional `mustReferenceEntities`, `mustCiteDocuments`, `expectedActionOutcome`, `forbiddenBehaviors`)

## ADK Shape
- Root agent:
- Tools: (list source-system-specific query_* and action_* tools; must match the tool intent names above)
- Sub-agents:
- MCP/A2A mocks:
- Local run command: uv run adk web

## Validation
- Smoke prompt:
- Expected answer:
- Data assertions:
- Source-system naming assertions:
- Referential-integrity assertions:
- Document-content assertions:
- API fixture assertions:
- Eval idea:

## Boundaries
- Local-only assumptions:
- Approval needed before deploy:
- Gemini Enterprise readiness:
```

## Data Specification Rules

The data specification section is consumed by `ge-mock` CLI commands:

1. **Volume** maps to `--rows` flag on `ge-mock generate`
2. **Entities & Schemas** map to `ge-mock schema --add-table` JSON
3. **Distributions** map to `weights` arrays on enum columns
4. **Relationships** map to `ref` column types
5. **Anomalies** map to the `anomalies` array in the schema
6. **Documents** map to the `documents` array in the schema
7. **Behavior Contract** maps to `generationSpec.behaviorContract` on the slide and `mock_systems/usecase-spec.json.behaviorContract` in the workspace. `ge-mock tools` reads it to render `app/agent.py`'s instruction, the contract tool intents in `app/tools.py`, and `evals/golden.json`.

The interviewer MUST ask about volume, anomalies, source-system ownership,
**and the behavior contract (role, primary objective, tool intents,
evidence requirements, escalation rules, refusal rules, golden evals)** at
minimum. Distributions, relationships, API contracts, documents, and
datastore packaging can use smart defaults if the user agrees, but the
behavior contract has no safe default — the agent has nothing to do
without it.

## Smart Defaults by Domain

If the user skips data questions, use these defaults:

| Domain | Volume | Anomaly Pattern | Documents |
|--------|--------|----------------|-----------|
| HR | 50 rows | Skills gap by region | 5 HR docs (leave policy, comp policy, onboarding SOP, attrition report, benefits FAQ) |
| Finance | 50 rows | Budget variance spike in Q1 | 5 Finance docs (expense policy, procurement policy, close SOP, variance report, controls audit) |
| IT | 50 rows | P1 incident spike in one category | 5 IT docs (security policy, change policy, incident SOP, SLA report, access FAQ) |
| Procurement | 50 rows | Vendor concentration risk | 5 Procurement docs (sourcing policy, RFP SOP, MSA template, spend report, vendor risk) |
| Marketing | 50 rows | Channel underperformance | 5 Marketing docs (brand guidelines, campaign SOP, performance report, budget memo, tools FAQ) |
