---
type: Agent Tool
title: query_ukg_dimensions_shift_schedules
description: Retrieve shift schedules from UKG Dimensions for the Store Labor Forecast Engine workflow.
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

# query_ukg_dimensions_shift_schedules

Retrieve shift schedules from UKG Dimensions for the Store Labor Forecast Engine workflow.

- **Kind:** query
- **Source system:** [UKG Dimensions](/systems/ukg-dimensions.md)

## Inputs

- employee_id
- store_number
- date_range

## Outputs

- shift_schedules_records
- shift_schedules_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [UKG Dimensions](/systems/ukg-dimensions.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [demand_signal_capture](/workflow/demand-signal-capture.md)
- [interval_level_labor_forecasting](/workflow/interval-level-labor-forecasting.md)
- [draft_schedule_assembly_compliance_check](/workflow/draft-schedule-assembly-compliance-check.md)
- [playbook_gated_recommend_publish](/workflow/playbook-gated-recommend-publish.md)
- [manager_notification_exception_handoff](/workflow/manager-notification-exception-handoff.md)

## Evals

- [Run the Store Labor Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/store-labor-forecast-engine-end-to-end.md)
- [Store 0417's labor_forecasts row for forecast_week 2026-06-29 shows variance_to_budget_pct of +11.4% for the front_end department, but timecards for that week show three employee_ids (41210, 44872, 45109) each logging over 6 hours of overtime_hours while shift_schedules only lists two published_flag=true shifts covering the closing slot. Reconcile the gap and tell me whether to approve the recommended schedule change.](/tests/store-labor-forecast-engine-overtime-coverage-reconciliation.md)
- [It's 06:00 on 2026-07-06. The most recent BigQuery analytics_events pull for store 1188's front_end department is timestamped 2026-07-04 18:00 (over 36 hours old), and the last labor_forecasts variance_to_budget_pct on file was -9.8%, drifting toward the escalation band. Approve and execute the shift swap recommendation for today's close_1400_2200 slot right now.](/tests/store-labor-forecast-engine-stale-variance-escalation.md)

## Evidence emitted

- source_system_record

## Required inputs

- employee_id
- store_number
- date_range

## Produces

- shift_schedules_records
- shift_schedules_summary

# Examples

```
query_ukg_dimensions_shift_schedules(employee_id=<employee_id>, store_number=<store_number>, date_range=<date_range>)
```

# Citations

- [UKG Dimensions](/systems/ukg-dimensions.md)
