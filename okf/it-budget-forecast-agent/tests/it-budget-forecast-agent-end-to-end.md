---
type: Eval Scenario
title: Run the IT Budget Forecast Agent workflow for the current period. Cite the re...
description: "Run the IT Budget Forecast Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "it-budget-forecast-agent-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the IT Budget Forecast Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [spend-aggregation](/queries/spend-aggregation.md)

## Mechanisms to call

- [query_aws_cost_explorer_billing_records](/tools/query-aws-cost-explorer-billing-records.md)
- [query_gcp_billing_billing_records](/tools/query-gcp-billing-billing-records.md)
- [query_servicenow_spm_tickets](/tools/query-servicenow-spm-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_it_budget_forecast_agent_runbook](/tools/lookup-it-budget-forecast-agent-runbook.md)

## Success rubric

CIO / CTO receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [IT Budget Forecast Agent Operations Runbook](/documents/it-budget-forecast-agent-runbook.md)
