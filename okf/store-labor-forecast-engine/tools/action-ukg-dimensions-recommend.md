---
type: Agent Tool
title: action_ukg_dimensions_recommend
description: Execute the recommend step in UKG Dimensions after the agent has gathered evidence and validated escalation gates.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_ukg_dimensions_recommend

Execute the recommend step in UKG Dimensions after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [UKG Dimensions](/systems/ukg-dimensions.md)
- **API:** POST /api/ukg_dimensions/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change UKG Dimensions state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_ukg_dimensions_recommend](/policies/confirmation-action-ukg-dimensions-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [UKG Dimensions](/systems/ukg-dimensions.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [interval_level_labor_forecasting](/workflow/interval-level-labor-forecasting.md)
- [draft_schedule_assembly_compliance_check](/workflow/draft-schedule-assembly-compliance-check.md)
- [playbook_gated_recommend_publish](/workflow/playbook-gated-recommend-publish.md)
- [manager_notification_exception_handoff](/workflow/manager-notification-exception-handoff.md)

## Evals

- [Run the Store Labor Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/store-labor-forecast-engine-end-to-end.md)
- [Store 0417's labor_forecasts row for forecast_week 2026-06-29 shows variance_to_budget_pct of +11.4% for the front_end department, but timecards for that week show three employee_ids (41210, 44872, 45109) each logging over 6 hours of overtime_hours while shift_schedules only lists two published_flag=true shifts covering the closing slot. Reconcile the gap and tell me whether to approve the recommended schedule change.](/tests/store-labor-forecast-engine-overtime-coverage-reconciliation.md)

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
action_ukg_dimensions_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [UKG Dimensions](/systems/ukg-dimensions.md)
- [Confirmation policy — action_ukg_dimensions_recommend](/policies/confirmation-action-ukg-dimensions-recommend.md)
- [Idempotency policy — action_ukg_dimensions_recommend](/policies/idempotency-action-ukg-dimensions-recommend.md)
