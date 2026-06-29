---
name: ge-agent-pipeline
description: |
  Use for GE Demo Generator pipeline work: capability-driven local mock data,
  fixture-backed source adapters, validation, preview, deploy plans, publish
  plans, and explicit live deploy/publish handoffs. Prefer the top-level ge CLI
  and workspace manifest over direct file edits.
triggers:
  - "mock data"
  - "generate fixtures"
  - "mock system"
  - "fixture tools"
  - "source adapters"
  - "API"
  - "MCP"
  - "capability pipeline"
  - "deploy plan"
  - "publish plan"
  - "agent pipeline"
  - "ge create"
  - "ge validate"
  - "factory"
inputs:
  - name: workspace_dir
    type: string
    required: false
  - name: use_case_id
    type: string
    required: false
  - name: freeform
    type: string
    required: false
  - name: domain
    type: enum
    values: [hr, finance, it, marketing, procurement]
    required: false
outputs:
  primary: workspace.json
  secondary: [fixtures/manifest.json, app/tools.py, app/agent.py, tests/test_smoke.py, artifacts/]
resources:
  scripts:
    - path: scripts/check-usecase-spec.mjs
      purpose: Deterministically validates canonical source-system naming, behavior contracts, data contracts, row policy, and generic mock-name drift.
      use_when: Auditing generated workspace specs, manifests, and source adapter tools.
  references:
    - path: references/usecase-spec-contract.md
      purpose: Canonical source-system, behavior, schema, document, row-count, and referential-integrity contract.
      use_when: Creating, auditing, or repairing generated workspace specs and fixtures.
    - path: references/behavior-contract.md
      purpose: AgentBehaviorContract schema, factory wiring, and quality gates that stop generic agents.
      use_when: Authoring or auditing the slide-level behaviorContract before any agent generation.
    - path: references/factory-scale-contract.md
      purpose: Batch factory contract for generating, validating, deploying, registering, and publishing hundreds of agents.
      use_when: Planning or repairing department/all-domain factory runs.
    - path: references/adk-agent-structure.md
      purpose: ADK workspace file layout and root_agent expectations.
      use_when: Patching app/agent.py, app/tools.py, pyproject.toml, or README commands.
    - path: references/fixture-contract.md
      purpose: Fixture manifest and mocked tool evidence contract.
      use_when: Auditing or regenerating fixtures and source-system tools.
    - path: references/mock-system-matrix.md
      purpose: Source-system-to-mock mapping guidance.
      use_when: Choosing mocked systems or tool boundaries.
  assets:
    - path: assets/workspace-layout.yaml
      purpose: Canonical capability-driven workspace folder layout.
      use_when: Creating or auditing workspace structure.
example_prompt: |
  Create a local-first HR benefits agent workspace with deterministic mock
  Workday, Benefits Platform, and Google Chat data. Validate it, but do not deploy.
---

# GE Agent Pipeline

Use this as the top-level router for moving a GE workspace through the capability path:

```
brief -> behavior-contract -> create -> validate -> preview -> deploy:plan -> publish:plan -> deploy/publish only on explicit approval
```

Prefer `ge` commands. Use `factory` only for targeted regeneration inside an existing workspace.

**Behavior-contract gate (must pass before `ge create`):** read `references/behavior-contract.md`, confirm the slide's `generationSpec.behaviorContract` declares role, primaryObjective, ≥3 toolIntents with at least one non-query intent, evidenceRequirements, escalationRules, refusalRules, and ≥1 goldenEval whose `expectedToolCalls` reference declared intents. If any of these are missing, stop and route back to the slide owner — do not let the factory fall back to a generic shell agent.

## Decide

- Fuzzy request: use `ge-contextual-agent-interviewer`.
- New or broken ADK workspace: use `ge-foolproof-adk-agent-builder`.
- Mock data/datastore work: use `ge-cloud-mock-data`.
- API/MCP service boundary work: use `ge-api-service-adapter`.
- Existing workspace quality pass: use `ge-iterative-agent-refinement`.
- Status-only answer: use `ge-agent-tracker`.

## Commands

```bash
ge create --name <workspace-id> --usecase <use-case-id> --rows 50 --seed 42
ge validate <workspace-id>
ge preview <workspace-id>
ge deploy:plan <workspace-id> --target agent_runtime
ge publish:plan <workspace-id> --app-id <GEMINI_ENTERPRISE_APP_ID>
```

Never deploy or publish live resources unless explicitly requested.

## Bundled Resources

- `references/behavior-contract.md`: read BEFORE any generation step; it is the contract that turns a slide into a real agent build spec.
- `references/adk-agent-structure.md`: only when patching ADK files.
- `references/fixture-contract.md`: only when evaluating fixtures/tools.
- `references/mock-system-matrix.md`: only when mapping source systems.
- `assets/workspace-layout.yaml`: copy or compare when enforcing workspace structure.

## Output

End with: workspace id, capabilities, readiness, files changed, validation result, and next action.

If the workspace is missing several of these, run `ge create` or use `factory from-usecase` only as a fallback.

## Capability Rules

- Local mock mode is the default.
- Do not require Google auth for mock-only work.
- Treat external systems as deterministic source-system simulators unless live wiring is requested. Name tools after the real source systems, not generic mock sources.
- Generated tools must return evidence: SQL-like result, source-system record, document reference, or audit trail.
- Every workspace must include `mock_systems/usecase-spec.json` with canonical systems, behavior contract, schemas, row policy, document requirements, and integrity rules.
- Do not generate an ADK agent from a synthesized or missing behavior contract. Patch the upstream TSX `generationSpec.behaviorContract` first, then regenerate.
- Keep data deterministic with a visible seed.
- Prefer regenerating fixtures/tools through CLI commands over hand-written JSON.
- Prefer official `agents-cli` commands for scaffold, eval, deployment, publish, and observability.
- Treat source data as a collection of datastores, not one table dump. Use the slide-derived source map to choose AlloyDB, Firestore, Bigtable, BigQuery, and Cloud Storage packages.
- Use Snowfakery YAML as the first-class structured data recipe for OLTP and OLAP rows. Packagers decide datastore shape and load artifacts.
- Treat REST/gRPC/GraphQL/RFC/SFTP/API systems as source adapters. Generate OpenAPI, JSON-backed fixtures, MCP tool manifests, and optional Cloud Run/API Gateway plans under `mock_data/apis/`.

## When Direct `factory` Is Acceptable

Use direct `factory` only for a narrow repair:

```bash
factory status --dir <workspace>
factory sources --slides ../../src/components/slides/use-cases
factory plan-data --dir <workspace> --usecase <UseCaseName>
factory snowfakery-recipe --dir <workspace>
node .gemini/skills/ge-api-service-adapter/scripts/check-api-package.mjs --dir <workspace>
node .gemini/skills/ge-agent-pipeline/scripts/check-usecase-spec.mjs --dir <workspace>
factory generate --dir <workspace> --seed 42
factory tools --dir <workspace>
factory test --dir <workspace>
factory data-plan --dir <workspace> --project <project> --location US
```

## References

Load only when needed:

- `references/mock-system-matrix.md` — choosing data/API/MCP/A2A mock shapes
- `references/usecase-spec-contract.md` — canonical system/tool naming, schemas, document content, row counts, and referential integrity
- `references/factory-scale-contract.md` — 360-agent factory queueing, artifact, idempotency, retry, and batch reporting contract
- `references/fixture-contract.md` — fixture manifest requirements
- `references/adk-agent-structure.md` — ADK file layout
- `.gemini/skills/ge-cloud-mock-data/SKILL.md` — cloud-ready mock data package, BigQuery/Cloud Storage target, and non-skeleton data gates
- `.gemini/skills/ge-usecase-source-mapper/SKILL.md` — slide source extraction and datastore classification
- `.gemini/skills/ge-snowfakery-structured-data/SKILL.md` — Snowfakery YAML row generation for OLTP/OLAP
- `.gemini/skills/ge-oltp-cloud-packager/SKILL.md` — AlloyDB, Firestore, Bigtable packaging
- `.gemini/skills/ge-olap-bigquery-packager/SKILL.md` — BigQuery schemas and load files
- `.gemini/skills/ge-unstructured-blob-packager/SKILL.md` — PDF/DOCX/Markdown/blob evidence packaging
- `.gemini/skills/ge-api-service-adapter/SKILL.md` — OpenAPI, JSON-backed API fixtures, MCP SSE adapters, and mc-systems-compatible service packages

## Completion Packet

When running inside a harness, finish with:

- Status
- Files changed
- Validation command and result
- Workspace capabilities gained
- Next action from `workspace.json`
