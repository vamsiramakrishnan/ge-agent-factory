---
type: Agent Tool
title: query_siemens_opcenter_mes_production_orders
description: Retrieve production orders from Siemens Opcenter MES for the OEE Loss Pareto Analyzer workflow.
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

Retrieve production orders from Siemens Opcenter MES for the OEE Loss Pareto Analyzer workflow.

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

- [shift_line_data_pull](/workflow/shift-line-data-pull.md)
- [loss_bucket_decomposition_dollarization](/workflow/loss-bucket-decomposition-dollarization.md)
- [pareto_publish_kaizen_handoff](/workflow/pareto-publish-kaizen-handoff.md)

## Evals

- [Run the OEE Loss Pareto Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/oee-loss-pareto-analyzer-end-to-end.md)
- [Production order 1483221 at plant 1020 shows a scrap_qty of 92 against a planned_qty of 640 for the July 2 day shift, but the BigQuery historical_metrics baseline for that line still shows quality-loss variance_pct at only -4% versus last month. Before you publish the loss Pareto to Looker, tell me which number governs and what the OEE Loss Classification and Calculation Standard says about dollarizing it.](/tests/oee-loss-pareto-analyzer-conflicting-baseline.md)

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
