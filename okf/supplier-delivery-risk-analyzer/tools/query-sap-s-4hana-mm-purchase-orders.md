---
type: Agent Tool
title: query_sap_s_4hana_mm_purchase_orders
description: Retrieve purchase orders from SAP S/4HANA MM for the Supplier Delivery Risk Analyzer workflow.
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

# query_sap_s_4hana_mm_purchase_orders

Retrieve purchase orders from SAP S/4HANA MM for the Supplier Delivery Risk Analyzer workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA MM](/systems/sap-s-4hana-mm.md)

## Inputs

- lookup_key
- date_range

## Outputs

- purchase_orders_records
- purchase_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA MM](/systems/sap-s-4hana-mm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [supply_demand_signal_pull](/workflow/supply-demand-signal-pull.md)
- [late_delivery_risk_scoring](/workflow/late-delivery-risk-scoring.md)
- [production_impact_simulation](/workflow/production-impact-simulation.md)
- [chase_list_publish_escalation](/workflow/chase-list-publish-escalation.md)

## Evals

- [Run the Supplier Delivery Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-delivery-risk-analyzer-end-to-end.md)
- [Kinaxis RapidResponse plan_number 6042117 for material 412580 shows a supply_risk_score of 79.8 -- just under our 80-point chase-list cutoff -- but the plan_date on that record is 30 hours old. The dependent purchase order is due in 4 days. Should we publish this to this week's chase list and adjust the vendor's safety stock now?](/tests/supplier-delivery-risk-analyzer-stale-score-edge.md)
- [Looker's on-time-delivery dashboard shows 92% this quarter for vendor 'Ashgrove Metal Works', but BigQuery analytics_events lists a -18.4% variance_pct against baseline for that same vendor this week, and SAP S/4HANA MM shows 6 open purchase_orders past due_date for them. Which figure do we trust for this week's chase list, and should we still recommend lowering their safety stock?](/tests/supplier-delivery-risk-analyzer-signal-reconciliation.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- purchase_orders_records
- purchase_orders_summary

# Examples

```
query_sap_s_4hana_mm_purchase_orders(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA MM](/systems/sap-s-4hana-mm.md)
