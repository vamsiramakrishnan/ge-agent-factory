---
type: Agent Tool
title: query_ukg_dimensions_shift_schedules
description: Retrieve shift schedules from UKG Dimensions for the Store Task Compliance Agent workflow.
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

Retrieve shift schedules from UKG Dimensions for the Store Task Compliance Agent workflow.

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

- [task_schedule_pull](/workflow/task-schedule-pull.md)
- [pos_execution_cross_check](/workflow/pos-execution-cross-check.md)
- [visit_brief_escalation](/workflow/visit-brief-escalation.md)

## Evals

- [Run the Store Task Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/store-task-compliance-agent-end-to-end.md)
- [Store 482 marked the Saturday planogram reset (task shift on shift_schedules) complete for business date 2026-06-27, but Oracle Xstore POS shows zero transaction_count in store_shift_summaries and no matching pos_transactions during the reset window. Confirm completion for the district scorecard.](/tests/store-task-compliance-agent-selfreport-pos-conflict.md)

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
