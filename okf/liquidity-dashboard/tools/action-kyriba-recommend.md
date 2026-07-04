---
type: Agent Tool
title: action_kyriba_recommend
description: Execute the recommend step in Kyriba after the agent has gathered evidence and validated escalation gates.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_kyriba_recommend

Execute the recommend step in Kyriba after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Kyriba](/systems/kyriba.md)
- **API:** POST /api/kyriba/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Kyriba state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_kyriba_recommend](/policies/confirmation-action-kyriba-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kyriba](/systems/kyriba.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [treasury_briefing_generation](/workflow/treasury-briefing-generation.md)

## Evals

- [Run the Liquidity Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/liquidity-dashboard-end-to-end.md)

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
action_kyriba_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Kyriba](/systems/kyriba.md)
- [Confirmation policy — action_kyriba_recommend](/policies/confirmation-action-kyriba-recommend.md)
- [Idempotency policy — action_kyriba_recommend](/policies/idempotency-action-kyriba-recommend.md)
