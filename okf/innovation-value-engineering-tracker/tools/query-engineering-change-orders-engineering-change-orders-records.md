---
type: Agent Tool
title: query_engineering_change_orders_engineering_change_orders_records
description: "Retrieve engineering change orders records from Engineering Change Orders for the Innovation & Value Engineering Tracker workflow."
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

# query_engineering_change_orders_engineering_change_orders_records

Retrieve engineering change orders records from Engineering Change Orders for the Innovation & Value Engineering Tracker workflow.

- **Kind:** query
- **Source system:** [Engineering Change Orders](/systems/engineering-change-orders.md)

## Inputs

- lookup_key
- date_range

## Outputs

- engineering_change_orders_records_records
- engineering_change_orders_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Engineering Change Orders](/systems/engineering-change-orders.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [feasibility_reasoning_value_assessment](/workflow/feasibility-reasoning-value-assessment.md)

## Evals

- [Run the Innovation & Value Engineering Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/innovation-value-engineering-tracker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- engineering_change_orders_records_records
- engineering_change_orders_records_summary

# Examples

```
query_engineering_change_orders_engineering_change_orders_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Engineering Change Orders](/systems/engineering-change-orders.md)
