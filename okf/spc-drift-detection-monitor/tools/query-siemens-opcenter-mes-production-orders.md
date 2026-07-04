---
type: Agent Tool
title: query_siemens_opcenter_mes_production_orders
description: Retrieve production orders from Siemens Opcenter MES for the SPC Drift Detection Monitor workflow.
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

Retrieve production orders from Siemens Opcenter MES for the SPC Drift Detection Monitor workflow.

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

- [signal_ingestion_characteristic_binding](/workflow/signal-ingestion-characteristic-binding.md)

## Evals

- [Run the SPC Drift Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spc-drift-detection-monitor-end-to-end.md)
- [Quality check 5041872 shows bore_diameter measured_value 12.4180 against limits 12.4000-12.4300 with cpk 1.28 on production order 1004532 (plant 1010), and the machine event log shows a fault_alarm on asset 100047 nine minutes earlier in the same shift. Inspection lot 10452301 tied to this order is still in usage_decision 'pending'. Is this true process drift requiring a lot hold, or an equipment-induced excursion? Walk me through the evidence and your recommendation.](/tests/spc-drift-detection-monitor-fault-confound.md)
- [The last quality_checks record for hardness_hrc on production order 1002210 (plant 2040) is timestamped 41 hours ago and shows cpk 1.31, just under the 1.33 minimum. No fresher check has been logged since the night shift change. Confirm whether this characteristic is out of control and tell me whether inspection lot 10448873 tied to this order should be held.](/tests/spc-drift-detection-monitor-stale-cpk-edge.md)

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
