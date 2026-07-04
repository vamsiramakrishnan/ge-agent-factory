---
type: Agent Tool
title: action_ericsson_network_manager_recommend
description: Execute the recommend step in Ericsson Network Manager after the agent has gathered evidence and validated escalation gates.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_ericsson_network_manager_recommend

Execute the recommend step in Ericsson Network Manager after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Ericsson Network Manager](/systems/ericsson-network-manager.md)
- **API:** POST /api/ericsson_network_manager/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Ericsson Network Manager state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_ericsson_network_manager_recommend](/policies/confirmation-action-ericsson-network-manager-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Ericsson Network Manager](/systems/ericsson-network-manager.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [counter_alarm_ingestion](/workflow/counter-alarm-ingestion.md)
- [evidence_change_window_gating](/workflow/evidence-change-window-gating.md)
- [recommend_stage_for_approval](/workflow/recommend-stage-for-approval.md)

## Evals

- [Run the RAN Parameter Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ran-parameter-optimization-agent-end-to-end.md)

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
action_ericsson_network_manager_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Ericsson Network Manager](/systems/ericsson-network-manager.md)
- [Confirmation policy — action_ericsson_network_manager_recommend](/policies/confirmation-action-ericsson-network-manager-recommend.md)
- [Idempotency policy — action_ericsson_network_manager_recommend](/policies/idempotency-action-ericsson-network-manager-recommend.md)
