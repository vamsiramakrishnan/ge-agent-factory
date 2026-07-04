---
type: Eval Scenario
title: "Run the Merit & Promotion Budget Modeler Agent workflow for the current perio..."
description: "Run the Merit & Promotion Budget Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "merit-promotion-budget-modeler-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Merit & Promotion Budget Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [budget-comp-data-ingestion](/queries/budget-comp-data-ingestion.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_merit_promotion_budget_modeler_agent_policy_handbook](/tools/lookup-merit-promotion-budget-modeler-agent-policy-handbook.md)

## Success rubric

Comp Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Merit & Promotion Budget Modeler Agent Policy Handbook](/documents/merit-promotion-budget-modeler-agent-policy-handbook.md)
