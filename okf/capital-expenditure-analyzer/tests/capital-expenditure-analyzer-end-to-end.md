---
type: Eval Scenario
title: Run the Capital Expenditure Analyzer workflow for the current period. Cite th...
description: "Run the Capital Expenditure Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "capital-expenditure-analyzer-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Capital Expenditure Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [request-comparable-retrieval](/queries/request-comparable-retrieval.md)

## Mechanisms to call

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_capital_expenditure_analyzer_controls_playbook](/tools/lookup-capital-expenditure-analyzer-controls-playbook.md)
- [action_sap_s_4hana_generate](/tools/action-sap-s-4hana-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA, with audit-trail entry and CFO / VP Finance notified of outcomes.

# Citations

- [Capital Expenditure Analyzer Controls Playbook](/documents/capital-expenditure-analyzer-controls-playbook.md)
