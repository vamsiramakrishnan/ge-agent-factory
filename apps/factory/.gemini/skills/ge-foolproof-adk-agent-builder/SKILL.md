---
name: ge-foolproof-adk-agent-builder
description: |
  Use when building or repairing a complete local-first Python ADK agent
  workspace for GE Demo Generator. Produces root_agent, source-system tools,
  deterministic fixtures, uv project files, tests, README, and capability
  manifest without requiring Google auth or live deployment. Refuses to
  scaffold an agent unless the upstream slide carries a behavior contract
  (role, scope, tool intents, evidence requirements, escalation rules,
  refusal rules, golden evals).
triggers:
  - "build an ADK agent"
  - "generate an agent"
  - "create agent workspace"
  - "write agent code"
  - "scaffold agent"
  - "local-first ADK"
  - "root_agent"
  - "uv run"
inputs:
  - name: brief
    type: string
    required: false
  - name: use_case_id
    type: string
    required: false
  - name: workspace_dir
    type: string
    required: false
  - name: behavior_contract
    type: object
    required: true
    description: |
      Required. The upstream slide's generationSpec.behaviorContract: role,
      primaryObjective, inScope, outOfScope, toolIntents (with kind,
      sourceSystemId, requiredInputs, produces, evidenceEmitted),
      evidenceRequirements, escalationRules, refusalRules, and goldenEvals.
      If missing, invoke ge-contextual-agent-interviewer to elicit it before
      writing any files. Generating without it produces a hello-world agent.
outputs:
  primary: app/agent.py
  secondary: [app/tools.py, pyproject.toml, fixtures/, tests/, evals/golden.json, README.md, workspace.json]
resources:
  scripts:
    - path: scripts/agent-brief.mjs
      purpose: Convert request metadata into an agent build brief.
      use_when: A structured brief should be generated before writing files.
  references:
    - path: references/build-contract.md
      purpose: Required local-first ADK files and quality gates.
      use_when: Creating or auditing generated workspace files.
    - path: references/interview-contract.md
      purpose: Brief intake fields needed before building.
      use_when: The user request is under-specified.
    - path: references/behavior-contract.md
      purpose: Required shape of generationSpec.behaviorContract and how it is rendered into agent.py / tools.py / evals/golden.json.
      use_when: Auditing whether the upstream slide is substantive enough to build, or wiring contract sections into the generated workspace.
  assets:
    - path: assets/local-adk-layout.yaml
      purpose: Template for local-first ADK workspace structure.
      use_when: Creating or repairing app/, fixtures/, tests/, and README layout.
example_prompt: |
  Build a local-first ADK agent for HR benefits enrollment with deterministic Workday,
  Benefits Platform, and Google Chat tools. The slide must already declare a
  behaviorContract with tool intents, evidence requirements, escalation rules,
  refusal rules, and golden evals. Include uv commands and a smoke test.
---

# GE Foolproof ADK Agent Builder

End with a runnable local-first ADK workspace, not a design note. Refuse to
emit an agent that has nothing to *do* — the upstream slide's behavior
contract is the load-bearing input.

## Flow

1. **Gate on contract**. Inspect `generationSpec.behaviorContract` on the
   upstream slide (or `mock_systems/usecase-spec.json.behaviorContract`
   inside an existing workspace). If `role`, `primaryObjective`, `toolIntents`,
   `evidenceRequirements`, `escalationRules`, `refusalRules`, or `goldenEvals`
   are missing or shallow, **stop and invoke `ge-contextual-agent-interviewer`**
   to fill the contract before writing any files. Load
   `references/behavior-contract.md` for the required shape.
2. Bootstrap with `agents-cli` or `ge create` where available.
3. Keep the local path mock-only: no Google auth, no Vertex env vars, no live deploy.
4. Patch only missing or weak files.
5. Run `ge validate` or workspace-local `ge validate`. **All `behavior:*`,
   `agent:contract_*`, and `evals:golden_file` checks must pass**, not just
   the file-existence checks.
6. Report capabilities and next action.

## Required Files

```
pyproject.toml
app/__init__.py
app/agent.py                       # instruction rendered from behavior contract
app/tools.py                       # per-table queries + contract tool intents
fixtures/manifest.json
fixtures/tables/*.json
mock_systems/usecase-spec.json     # carries the behavior contract
evals/golden.json                  # mirrors contract.goldenEvals
tests/test_smoke.py
README.md
workspace.json
```

`app/agent.py` exposes `root_agent` and its `instruction` MUST render the
contract sections `PRIMARY OBJECTIVE`, `IN SCOPE`, `OUT OF SCOPE`,
`TOOL PLAYBOOK`, `EVIDENCE YOU MUST CITE`, `ESCALATION & REFUSAL TRIGGERS`,
and `HARD GUARDRAILS`. `app/tools.py` returns deterministic source-system
evidence and defines a Python function for every non-query tool intent
(`action`, `notification`, `evidence_lookup`, `calculation`) using the
contract's canonical name. The generic "Use the fixture-backed source
adapters to inspect available data. Never invent data." instruction is a
failure mode — it means the contract was not threaded into the agent.

## Commands

```bash
agents-cli info
agents-cli create <project-name> --agent adk --prototype --deployment-target none
ge create --name <workspace-id> --usecase <use-case-id> --rows 50 --seed 42
ge validate <workspace-id>
```

## Quality Bar

- **Behavior contract present and substantive**: role ≥20 chars,
  primaryObjective ≥60 chars, ≥3 tool intents, ≥1 non-query intent,
  ≥1 evidenceRequirement, ≥1 escalationRule, ≥1 refusalRule, ≥1 goldenEval.
  See `references/behavior-contract.md` for the full shape.
- One or more tools per canonical source system. Function names must include the real source system id, for example `query_workday_employees`.
- Every contract `toolIntent` with `kind != "query"` is emitted as a Python function in `app/tools.py` and listed in `source_adapters`.
- Include `mock_systems/usecase-spec.json` with systems, schemas, row policy, document requirements, referential-integrity rules, **and the behavior contract**.
- Evidence citations: source-system record, SQL-like result, audit trail, or document reference — matched to the contract's `evidenceRequirements`.
- `evals/golden.json` exists and mirrors `behaviorContract.goldenEvals`; every `expectedToolCalls` entry resolves to a declared tool intent name.
- Keep README commands copy-pasteable: `uv sync`, `uv run pytest`, `uv run adk web .`.

## Bundled Resources (load on demand)

- `references/build-contract.md`: when checking required file content.
- `references/interview-contract.md`: when converting fuzzy requirements.
- `references/behavior-contract.md`: when auditing the upstream slide's contract or wiring contract sections into the workspace.
- `scripts/agent-brief.mjs`: run for structured brief generation.
- `assets/local-adk-layout.yaml`: copy or compare when repairing workspace layout.
- Official installed skills: load `google-agents-cli-adk-code` only when writing ADK code; load scaffold/workflow/eval skills only for those phases.
