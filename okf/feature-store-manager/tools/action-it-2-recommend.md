---
type: Agent Tool
title: action_it_2_recommend
description: Execute the recommend step in IT 2 after the agent has gathered evidence and validated escalation gates.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_it_2_recommend

Execute the recommend step in IT 2 after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [IT 2](/systems/it-2.md)
- **API:** POST /api/it_2/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change IT 2 state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_it_2_recommend](/policies/confirmation-action-it-2-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [IT 2](/systems/it-2.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [reuse_recommendation](/workflow/reuse-recommendation.md)

## Evals

- [Run the Feature Store Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/feature-store-manager-end-to-end.md)

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
action_it_2_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [IT 2](/systems/it-2.md)
- [Confirmation policy — action_it_2_recommend](/policies/confirmation-action-it-2-recommend.md)
- [Idempotency policy — action_it_2_recommend](/policies/idempotency-action-it-2-recommend.md)
