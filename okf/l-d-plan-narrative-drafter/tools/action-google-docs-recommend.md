---
type: Agent Tool
title: action_google_docs_recommend
description: Execute the recommend step in Google Docs after the agent has gathered evidence and validated escalation gates.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_google_docs_recommend

Execute the recommend step in Google Docs after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Google Docs](/systems/google-docs.md)
- **API:** POST /api/google_docs/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Google Docs state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_google_docs_recommend](/policies/confirmation-action-google-docs-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Docs](/systems/google-docs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [strategy_narrative_drafting](/workflow/strategy-narrative-drafting.md)
- [formatting_distribution](/workflow/formatting-distribution.md)

## Evals

- [Run the L&D Plan Narrative Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/l-d-plan-narrative-drafter-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_google_docs_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Google Docs](/systems/google-docs.md)
- [Confirmation policy — action_google_docs_recommend](/policies/confirmation-action-google-docs-recommend.md)
- [Idempotency policy — action_google_docs_recommend](/policies/idempotency-action-google-docs-recommend.md)
