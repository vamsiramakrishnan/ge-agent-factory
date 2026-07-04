---
type: Query Capability
title: "Cloud spend forecasting with seasonal decomposition, license utilization tren..."
description: "Cloud spend forecasting with seasonal decomposition, license utilization trending, CapEx/OpEx split analysis, and variance detection against plan. Time-series models identify emerging cost trends."
source_id: "forecast-modeling"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Cloud spend forecasting with seasonal decomposition, license utilization trending, CapEx/OpEx split analysis, and variance detection against plan. Time-series models identify emerging cost trends.

## Tools used

- [query_aws_cost_explorer_billing_records](/tools/query-aws-cost-explorer-billing-records.md)
- [lookup_it_budget_forecast_agent_runbook](/tools/lookup-it-budget-forecast-agent-runbook.md)

## Runs in

- [forecast_modeling](/workflow/forecast-modeling.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the IT Budget Forecast Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-budget-forecast-agent-end-to-end.md)

# Citations

- [IT Budget Forecast Agent Operations Runbook](/documents/it-budget-forecast-agent-runbook.md)
