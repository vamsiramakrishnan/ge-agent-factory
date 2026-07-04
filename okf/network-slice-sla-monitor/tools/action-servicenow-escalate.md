---
type: Agent Tool
title: action_servicenow_escalate
description: Execute the escalate step in ServiceNow after the agent has gathered evidence and validated escalation gates.
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

# action_servicenow_escalate

Execute the escalate step in ServiceNow after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [ServiceNow](/systems/servicenow.md)
- **API:** POST /api/servicenow/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change ServiceNow state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_servicenow_escalate](/policies/confirmation-action-servicenow-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [ServiceNow](/systems/servicenow.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [slice_telemetry_alarm_intake](/workflow/slice-telemetry-alarm-intake.md)
- [escalation_ticketing_audit_close_out](/workflow/escalation-ticketing-audit-close-out.md)

## Evals

- [Run the 5G Network Slice SLA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/network-slice-sla-monitor-end-to-end.md)

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
action_servicenow_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [ServiceNow](/systems/servicenow.md)
- [Confirmation policy — action_servicenow_escalate](/policies/confirmation-action-servicenow-escalate.md)
- [Idempotency policy — action_servicenow_escalate](/policies/idempotency-action-servicenow-escalate.md)
