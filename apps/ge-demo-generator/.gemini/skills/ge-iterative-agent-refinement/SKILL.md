---
name: ge-iterative-agent-refinement
description: |
  Use after a workspace exists to audit, repair, and validate it against the
  GE local-first quality bar. Focuses on business specificity, fixture
  credibility, ADK correctness, evidence quality, UI/demo readiness, and
  capability manifest accuracy.
triggers:
  - "iterate"
  - "refine"
  - "improve"
  - "make it better"
  - "review the agent"
  - "validate workspace"
  - "audit"
  - "fix the agent"
inputs:
  - name: workspace_dir
    type: string
    required: true
outputs:
  primary: artifacts/VALIDATION_REPORT.md
  secondary: [patched files, updated tests, workspace.json]
resources:
  scripts:
    - path: scripts/workspace-audit.mjs
      purpose: Deterministic workspace audit summary.
      use_when: Ranking weak areas before patching.
  references:
    - path: references/critique-rubric.md
      purpose: Detailed scoring rubric.
      use_when: A deeper quality audit is required.
    - path: references/iteration-loop.md
      purpose: Multi-pass refinement loop.
      use_when: Running more than one repair iteration.
  assets: []
example_prompt: |
  Audit this generated HR benefits agent and improve the weakest areas until
  it is credible for a local demo.
---

# GE Iterative Agent Refinement

Move from "generated files" to "demo-ready workspace." Keep each iteration small and verified.

## Audit Commands

```bash
ge validate <workspace-id>
ge-mock status --dir <workspace>
uv run pytest
```

Use `ge validate` as the main gate because it writes validation artifacts and refreshes `workspace.json`.

## Scorecard

Score 1-5:

- Business specificity: domain terms, persona, workflow moment, KPI.
- Behavior contract depth: role, primaryObjective, ≥3 tool intents with ≥1 non-query intent, ≥1 evidenceRequirement, ≥1 escalationRule, ≥1 refusalRule, ≥1 goldenEval. A workspace whose `mock_systems/usecase-spec.json.behaviorContract` is null or shallow scores 0 here — fix the upstream slide before patching anything else.
- Source-system fidelity: canonical system names, tool names, schemas, row counts, and datastore/API responsibilities match the slide.
- Fixture credibility: deterministic fixtures, relationships, anomaly, documents.
- ADK correctness: `root_agent`, uv project, no live auth in local path. The agent instruction must render the contract sections (`PRIMARY OBJECTIVE`, `TOOL PLAYBOOK`, `EVIDENCE YOU MUST CITE`, `HARD GUARDRAILS`) — the generic "Use the fixture-backed source adapters" stub scores 0.
- Evidence quality: tool outputs cite records, SQL-like results, documents, or audit trails, and match the contract's `evidenceRequirements`.
- Validation strength: tests prove the main workflow and KPI; `evals/golden.json` mirrors `behaviorContract.goldenEvals` and every `expectedToolCalls` entry resolves to a declared tool intent.
- Capability accuracy: `workspace.json` readiness, next actions, and skills match reality.

Patch the weakest high-impact item first. If behavior contract depth is
the gap, hand back to `ge-contextual-agent-interviewer` rather than
synthesizing a placeholder contract — placeholders defeat the validator.

## Patch Rules

- Prefer CLI regeneration for fixtures/tools.
- Fail and repair generic tool/source names such as `mock data source`, `query_mock_*`, or tables without `sourceSystemId`.
- Check `mock_systems/usecase-spec.json` before accepting schemas, document contents, row counts, or foreign keys.
- Prefer targeted patches for prompts, tests, README, and manifest.
- Do not deploy or publish unless explicitly approved.
- Keep generated evidence auditable and deterministic.
- Do not claim done until validation passes or the blocker is stated.

## Stop Condition

Stop when:

- `ge validate` passes, or
- the remaining blocker needs user/product input.

Final response must include files changed, validation result, current capabilities, and next action.

## Bundled Resources

- `scripts/workspace-audit.mjs`: run before patching when available.
- `references/critique-rubric.md`: detailed scoring.
- `references/iteration-loop.md`: multi-pass loop.
