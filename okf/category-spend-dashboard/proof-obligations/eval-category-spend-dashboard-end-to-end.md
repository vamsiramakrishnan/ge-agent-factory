---
type: Proof Obligation
title: "Golden eval obligation — Run the Category Spend Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-category-spend-dashboard-end-to-end"
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

# Golden eval obligation — Run the Category Spend Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [category-spend-dashboard-end-to-end](/tests/category-spend-dashboard-end-to-end.md)


## Mechanisms

- [query_coupa_analytics_requisitions](/tools/query-coupa-analytics-requisitions.md)
- [query_sap_ariba_analytics_suppliers](/tools/query-sap-ariba-analytics-suppliers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_category_spend_dashboard_policy_guide](/tools/lookup-category-spend-dashboard-policy-guide.md)
- [action_coupa_analytics_generate](/tools/action-coupa-analytics-generate.md)

## Entities that must be referenced

- requisitions
- suppliers
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [category-spend-dashboard-policy-guide](/documents/category-spend-dashboard-policy-guide.md)
