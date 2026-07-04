---
type: Agent Tool
title: query_manhattan_active_wm_warehouse_orders
description: "Retrieve warehouse orders from Manhattan Active WM for the Click-and-Collect SLA Monitor workflow."
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

# query_manhattan_active_wm_warehouse_orders

Retrieve warehouse orders from Manhattan Active WM for the Click-and-Collect SLA Monitor workflow.

- **Kind:** query
- **Source system:** [Manhattan Active WM](/systems/manhattan-active-wm.md)

## Inputs

- order_number
- dc_number
- date_range

## Outputs

- warehouse_orders_records
- warehouse_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Manhattan Active WM](/systems/manhattan-active-wm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)

## Evals

- [Run the Click-and-Collect SLA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/click-and-collect-sla-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- order_number
- dc_number
- date_range

## Produces

- warehouse_orders_records
- warehouse_orders_summary

# Examples

```
query_manhattan_active_wm_warehouse_orders(order_number=<order_number>, dc_number=<dc_number>, date_range=<date_range>)
```

# Citations

- [Manhattan Active WM](/systems/manhattan-active-wm.md)
