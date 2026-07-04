---
type: Eval Scenario
title: Run the Workforce Cost Modeling workflow for the current period. Cite the rel...
description: "Run the Workforce Cost Modeling workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "workforce-cost-modeling-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Workforce Cost Modeling workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cost-data-aggregation](/queries/cost-data-aggregation.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_workforce_cost_modeling_policy_handbook](/tools/lookup-workforce-cost-modeling-policy-handbook.md)

## Success rubric

CFO / CHRO receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Workforce Cost Modeling Policy Handbook](/documents/workforce-cost-modeling-policy-handbook.md)
