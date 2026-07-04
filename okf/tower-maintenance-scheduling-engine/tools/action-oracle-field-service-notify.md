---
type: Agent Tool
title: action_oracle_field_service_notify
description: Execute the notify step in Oracle Field Service after the agent has gathered evidence and validated escalation gates.
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

# action_oracle_field_service_notify

Execute the notify step in Oracle Field Service after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Oracle Field Service](/systems/oracle-field-service.md)
- **API:** POST /api/oracle_field_service/notify

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Oracle Field Service state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_oracle_field_service_notify](/policies/confirmation-action-oracle-field-service-notify.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Oracle Field Service](/systems/oracle-field-service.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [site_alarm_intake](/workflow/site-alarm-intake.md)
- [power_degradation_triage](/workflow/power-degradation-triage.md)
- [runbook_gate_dispatch](/workflow/runbook-gate-dispatch.md)

## Evals

- [Run the Tower Maintenance Scheduling Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tower-maintenance-scheduling-engine-end-to-end.md)

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
action_oracle_field_service_notify(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Oracle Field Service](/systems/oracle-field-service.md)
- [Confirmation policy — action_oracle_field_service_notify](/policies/confirmation-action-oracle-field-service-notify.md)
- [Idempotency policy — action_oracle_field_service_notify](/policies/idempotency-action-oracle-field-service-notify.md)
