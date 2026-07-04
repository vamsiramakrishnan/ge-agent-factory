---
type: Eval Scenario
title: Run the Procurement KPI Dashboard workflow for the current period. Cite the r...
description: "Run the Procurement KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "procurement-kpi-dashboard-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Procurement KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [kpi-data-aggregation](/queries/kpi-data-aggregation.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [lookup_procurement_kpi_dashboard_policy_guide](/tools/lookup-procurement-kpi-dashboard-policy-guide.md)
- [action_coupa_generate](/tools/action-coupa-generate.md)

## Success rubric

Action generate executed against Coupa, with audit-trail entry and CPO notified of outcomes.

# Citations

- [Procurement KPI Dashboard Procurement Policy Guide](/documents/procurement-kpi-dashboard-policy-guide.md)
