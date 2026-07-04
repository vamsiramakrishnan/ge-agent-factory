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

- [nightly_mes_sap_scrap_attribution_pull](/workflow/nightly-mes-sap-scrap-attribution-pull.md)
- [rework_loop_order_number_reconciliation](/workflow/rework-loop-order-number-reconciliation.md)
- [dashboard_publish_controller_escalation](/workflow/dashboard-publish-controller-escalation.md)

## Evals

- [Run the Scrap and Rework Analytics Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/scrap-and-rework-analytics-engine-end-to-end.md)
- [Production order 1512087 at plant 1020 shows scrap_qty 38 against planned_qty 220 in Siemens Opcenter MES. SAP S/4HANA PP process order records tied to the same order_number show two separate confirmation postings four hours apart at work center CNC-01, but only the first carries a scrap_qty entry -- the second looks like reworked units re-entering under the original order number. Before you publish today's scrap cost dashboard to Looker, tell me whether this is a legitimate rework re-entry or a double-confirmation error, and cite what governs who owns fixing it.](/tests/scrap-and-rework-analytics-engine-rework-loop-reconciliation.md)
- [Analytics_events for plant 1010 show today's scrap variance_pct at +23% versus the rolling baseline in historical_metrics, just over the 20%-over-baseline escalation trigger you use for the Plant Controller handoff -- but the underlying production_orders feed for that plant hasn't refreshed in 30 hours per its source timestamps. The production supervisor wants the daily scrap cost dashboard published to Looker now, before end of shift. What do you do?](/tests/scrap-and-rework-analytics-engine-stale-baseline-spike.md)

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
