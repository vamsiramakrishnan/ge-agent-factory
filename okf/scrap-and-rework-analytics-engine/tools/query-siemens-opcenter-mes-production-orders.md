---
type: Agent Tool
title: query_siemens_opcenter_mes_production_orders
description: Retrieve production orders from Siemens Opcenter MES for the Scrap and Rework Analytics Engine workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_siemens_opcenter_mes_production_orders

Retrieve production orders from Siemens Opcenter MES for the Scrap and Rework Analytics Engine workflow.

- **Kind:** query
- **Source system:** [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md)

## Inputs

- order_number
- date_range

## Outputs

- production_orders_records
- production_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Scrap and Rework Analytics Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/scrap-and-rework-analytics-engine-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- order_number
- date_range

## Produces

- production_orders_records
- production_orders_summary

# Examples

```
query_siemens_opcenter_mes_production_orders(order_number=<order_number>, date_range=<date_range>)
```

# Citations

- [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md)
