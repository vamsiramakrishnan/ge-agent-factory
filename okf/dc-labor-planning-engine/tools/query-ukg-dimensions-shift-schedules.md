---
type: Agent Tool
title: query_ukg_dimensions_shift_schedules
description: Retrieve shift schedules from UKG Dimensions for the DC Labor Planning Engine workflow.
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

Retrieve shift schedules from UKG Dimensions for the DC Labor Planning Engine workflow.

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

- [labor_standard_timecard_reconciliation](/workflow/labor-standard-timecard-reconciliation.md)
- [shift_plan_flex_labor_assembly](/workflow/shift-plan-flex-labor-assembly.md)
- [publish_audit_notify](/workflow/publish-audit-notify.md)

## Evals

- [Run the DC Labor Planning Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dc-labor-planning-engine-end-to-end.md)
- [DC 14 needs extra fulfillment_picker coverage for the wave surge on shift_date 2026-07-08. The draft shift_schedules row for employee_id 54213 at store_number 14 has schedule_posted_date of 2026-07-06 -- only 2 days ahead of the shift. UKG Dimensions labor_forecasts shows minimum_coverage_hours of 62.0 for online_fulfillment against forecast_hours of 74.5. Publish the updated shift plan now so picking starts on time.](/tests/dc-labor-planning-engine-notice-window-conflict.md)

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
