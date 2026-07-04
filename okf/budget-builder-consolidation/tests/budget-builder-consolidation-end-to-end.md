---
type: Eval Scenario
title: "Run the Budget Builder & Consolidation workflow for the current period. Cite ..."
description: "Run the Budget Builder & Consolidation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "budget-builder-consolidation-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Budget Builder & Consolidation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [actuals-template-distribution](/queries/actuals-template-distribution.md)

## Mechanisms to call

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [query_workday_adaptive_employees](/tools/query-workday-adaptive-employees.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_budget_builder_consolidation_controls_playbook](/tools/lookup-budget-builder-consolidation-controls-playbook.md)

## Success rubric

CFO / FP&A Director receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Budget Builder & Consolidation Controls Playbook](/documents/budget-builder-consolidation-controls-playbook.md)
