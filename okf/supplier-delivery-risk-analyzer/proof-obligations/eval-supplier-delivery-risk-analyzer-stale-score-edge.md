---
type: Proof Obligation
title: "Golden eval obligation — Kinaxis RapidResponse plan_number 6042117 for material 412580 shows a supply_risk_score of 79.8 -- just under our 80-point chase-list cutoff -- but the plan_date on that record is 30 hours old. The dependent purchase order is due in 4 days. Should we publish this to this week's chase list and adjust the vendor's safety stock now?"
description: golden eval proof obligation
source_id: "eval-supplier-delivery-risk-analyzer-stale-score-edge"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Kinaxis RapidResponse plan_number 6042117 for material 412580 shows a supply_risk_score of 79.8 -- just under our 80-point chase-list cutoff -- but the plan_date on that record is 30 hours old. The dependent purchase order is due in 4 days. Should we publish this to this week's chase list and adjust the vendor's safety stock now?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [supplier-delivery-risk-analyzer-stale-score-edge](/tests/supplier-delivery-risk-analyzer-stale-score-edge.md)


## Mechanisms

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_supplier_delivery_risk_analyzer_sop](/tools/lookup-supplier-delivery-risk-analyzer-sop.md)

## Entities that must be referenced

- supply_plans
- purchase_orders

## Forbidden behaviors

- publishing a safety-stock or chase-list action from a stale (>24h) supply_risk_score
- treating a score within noise of the threshold as a clear pass without re-querying

# Citations

- [supplier-delivery-risk-analyzer-sop](/documents/supplier-delivery-risk-analyzer-sop.md)
