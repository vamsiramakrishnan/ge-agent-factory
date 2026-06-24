---
name: ge-contextual-agent-interviewer
description: |
  Use for turning fuzzy GE demo requests into generation-ready briefs.
  Selects department, catalog use case or freeform path, systems, evidence,
  data volume, anomalies, and local/deploy/publish boundary with minimal
  questions. Produces explicit source-system, schema, document, API, datastore,
  row-count, and referential-integrity details for capability-driven ge create workflows.
triggers:
  - "interview"
  - "ask me questions"
  - "help me decide"
  - "choose a use case"
  - "what should I build"
  - "requirements"
  - "I want an agent that"
  - "how much data"
  - "what data do I need"
inputs:
  - name: department
    type: enum
    values: [hr, finance, it, marketing, procurement]
    required: false
  - name: request
    type: string
    required: false
outputs:
  primary: generation brief
  secondary: [ge create command, assumptions]
resources:
  scripts:
    - path: scripts/use-case-brief.mjs
      purpose: Generate a brief from a known catalog use case.
      use_when: A use_case_id is known and the catalog should drive defaults.
  references:
    - path: references/brief-contract.md
      purpose: Required fields for generation-ready briefs.
      use_when: Emitting the final brief.
    - path: references/interview-model.md
      purpose: Question strategy and inference rules.
      use_when: Requirements are ambiguous or multi-agent.
  assets: []
example_prompt: |
  I want an HR agent for benefits enrollment, but I do not know which systems,
  evidence, or data shape to use.
---

# GE Contextual Agent Interviewer

Turn vague intent into a runnable `ge create` brief. Ask one question at a time unless the user asks for a full form. If the user says "just pick", choose strong defaults and state them.

## Minimum Brief

Collect or infer:

- Department
- Use case or freeform description
- Persona and workflow moment
- Systems to mock
- Source-system ownership and canonical IDs
- Evidence to cite
- KPI before/after
- Data volume, seed, schemas, relationships, and document requirements
- One seeded anomaly or demo pattern
- API/MCP tool boundaries when a source system is API-backed
- Datastore packaging targets for OLTP, OLAP, NoSQL, blobs, and APIs
- **Behavior contract** (load `references/brief-contract.md` § Behavior Contract
  for the full shape): role, primaryObjective, inScope, outOfScope,
  toolIntents (≥3 with ≥1 non-query intent), evidenceRequirements,
  escalationRules, refusalRules, goldenEvals. No safe default — without this
  the factory emits a hello-world agent and `ge validate` fails on the
  `behavior:*` / `agent:contract_*` checks.
- Boundary: local mock, deploy plan, publish plan, or live mutation

Default boundary is local mock.

## Question Order

1. Department/use case: offer 3-5 catalog candidates when possible.
2. Workflow moment: chat, approval, investigation, report, dashboard, or automation.
3. Systems: offer the source systems from the catalog or department defaults. Confirm which system owns each entity.
4. Evidence: SQL-like result, source-system record, generated audit trail, document.
5. Data shape: row count, schemas, relationships, anomaly, document contents.
6. **Behavior contract** (load `references/brief-contract.md` § Behavior
   Contract before asking): role + primary objective first, then walk the
   tool intents, evidence requirements, escalation/refusal rules, and at
   least one golden eval. The contract is what makes the generated agent
   task-specific instead of a list/query shell.
7. API/datastore packaging: JSON-backed API, MCP, AlloyDB, Firestore, Bigtable, BigQuery, Cloud Storage.
8. Boundary: local mock by default.

Ask data volume, source-system ownership, anomaly, **and the behavior
contract** before generation. Those decisions most affect demo
credibility.

## Bundled Resources

- `references/brief-contract.md`: when emitting the final brief.
- `references/interview-model.md`: when the request is ambiguous or multi-agent.
- `scripts/use-case-brief.mjs`: when a catalog use case id is known.

## Output Format

End with a compact brief and command:

```markdown
Department:
Use case:
Persona:
Workflow moment:
Systems:
Evidence:
KPI:
Data:
Schemas:
Relationships:
Documents:
APIs:
Datastore packaging:
Boundary:
Command:
```

The command should be one of:

```bash
ge create --name <id> --usecase <use-case-id> --rows <n> --seed <seed>
ge create --name <id> --freeform "<description>" --domain <domain> --systems <a,b> --rows <n> --seed <seed>
```

## UI Question Forms

Use `<question-form>` only when choices are better than chat text. Keep labels short and defaults obvious.

Load on demand:

- `references/interview-model.md` — adaptive questioning
- `references/brief-contract.md` — JSON/Markdown brief shape
