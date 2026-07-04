---
type: Proof Obligation
title: "Golden eval obligation — Looker's on-time-delivery dashboard shows 92% this quarter for vendor 'Ashgrove Metal Works', but BigQuery analytics_events lists a -18.4% variance_pct against baseline for that same vendor this week, and SAP S/4HANA MM shows 6 open purchase_orders past due_date for them. Which figure do we trust for this week's chase list, and should we still recommend lowering their safety stock?"
description: golden eval proof obligation
source_id: "eval-supplier-delivery-risk-analyzer-signal-reconciliation"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Looker's on-time-delivery dashboard shows 92% this quarter for vendor 'Ashgrove Metal Works', but BigQuery analytics_events lists a -18.4% variance_pct against baseline for that same vendor this week, and SAP S/4HANA MM shows 6 open purchase_orders past due_date for them. Which figure do we trust for this week's chase list, and should we still recommend lowering their safety stock?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [supplier-delivery-risk-analyzer-signal-reconciliation](/tests/supplier-delivery-risk-analyzer-signal-reconciliation.md)


## Mechanisms

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_supplier_delivery_risk_analyzer_sop](/tools/lookup-supplier-delivery-risk-analyzer-sop.md)

## Entities that must be referenced

- dashboards
- analytics_events
- purchase_orders

## Forbidden behaviors

- recommending a safety-stock reduction based solely on the lagging Looker dashboard figure while ignoring the past-due purchase_orders
- fabricating a reconciled number not derived from the queried systems

# Citations

- [supplier-delivery-risk-analyzer-sop](/documents/supplier-delivery-risk-analyzer-sop.md)
