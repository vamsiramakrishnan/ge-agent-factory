---
type: Agent Tool
title: action_datadog_recommend
description: Execute the recommend step in Datadog after the agent has gathered evidence and validated escalation gates.
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

# action_datadog_recommend

Execute the recommend step in Datadog after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Datadog](/systems/datadog.md)
- **API:** POST /api/datadog/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Datadog state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_datadog_recommend](/policies/confirmation-action-datadog-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Datadog](/systems/datadog.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [sli_calculation](/workflow/sli-calculation.md)
- [reliability_narrative](/workflow/reliability-narrative.md)

## Evals

- [Run the SLO/SLI Monitor & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/slo-sli-monitor-reporter-end-to-end.md)

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
action_datadog_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Datadog](/systems/datadog.md)
- [Confirmation policy — action_datadog_recommend](/policies/confirmation-action-datadog-recommend.md)
- [Idempotency policy — action_datadog_recommend](/policies/idempotency-action-datadog-recommend.md)
