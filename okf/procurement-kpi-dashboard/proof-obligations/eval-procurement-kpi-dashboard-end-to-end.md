---
type: Proof Obligation
title: "Golden eval obligation — Run the Procurement KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-procurement-kpi-dashboard-end-to-end"
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

# Golden eval obligation — Run the Procurement KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [procurement-kpi-dashboard-end-to-end](/tests/procurement-kpi-dashboard-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [lookup_procurement_kpi_dashboard_policy_guide](/tools/lookup-procurement-kpi-dashboard-policy-guide.md)
- [action_coupa_generate](/tools/action-coupa-generate.md)

## Entities that must be referenced

- analytics_events
- dashboards
- requisitions
- suppliers

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [procurement-kpi-dashboard-policy-guide](/documents/procurement-kpi-dashboard-policy-guide.md)
