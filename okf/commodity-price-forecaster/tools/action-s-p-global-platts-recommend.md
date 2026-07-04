---
type: Agent Tool
title: action_s_p_global_platts_recommend
description: "Execute the recommend step in S&P Global Platts after the agent has gathered evidence and validated escalation gates."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_s_p_global_platts_recommend

Execute the recommend step in S&P Global Platts after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [S&P Global Platts](/systems/s-p-global-platts.md)
- **API:** POST /api/s_p_global_platts/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change S&P Global Platts state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_s_p_global_platts_recommend](/policies/confirmation-action-s-p-global-platts-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [S&P Global Platts](/systems/s-p-global-platts.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [event_interpretation_briefing](/workflow/event-interpretation-briefing.md)

## Evals

- [Run the Commodity Price Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/commodity-price-forecaster-end-to-end.md)

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
action_s_p_global_platts_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [S&P Global Platts](/systems/s-p-global-platts.md)
- [Confirmation policy — action_s_p_global_platts_recommend](/policies/confirmation-action-s-p-global-platts-recommend.md)
- [Idempotency policy — action_s_p_global_platts_recommend](/policies/idempotency-action-s-p-global-platts-recommend.md)
