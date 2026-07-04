---
type: Proof Obligation
title: "Golden eval obligation — Run the Demand Forecasting & Aggregation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-demand-forecasting-aggregation-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Demand Forecasting & Aggregation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [demand-forecasting-aggregation-end-to-end](/tests/demand-forecasting-aggregation-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_mm_pp_purchase_orders](/tools/query-sap-s-4hana-mm-pp-purchase-orders.md)
- [query_oracle_erp_oracle_erp_records](/tools/query-oracle-erp-oracle-erp-records.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_demand_forecasting_aggregation_policy_guide](/tools/lookup-demand-forecasting-aggregation-policy-guide.md)

## Entities that must be referenced

- purchase_orders
- oracle_erp_records
- requisitions
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [demand-forecasting-aggregation-policy-guide](/documents/demand-forecasting-aggregation-policy-guide.md)
