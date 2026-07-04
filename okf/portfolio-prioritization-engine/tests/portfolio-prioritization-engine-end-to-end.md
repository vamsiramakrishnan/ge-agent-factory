---
type: Eval Scenario
title: Run the Portfolio Prioritization Engine workflow for the current period. Cite...
description: "Run the Portfolio Prioritization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "portfolio-prioritization-engine-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Portfolio Prioritization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [intake-aggregation](/queries/intake-aggregation.md)

## Mechanisms to call

- [query_servicenow_spm_tickets](/tools/query-servicenow-spm-tickets.md)
- [query_jira_portfolio_issues](/tools/query-jira-portfolio-issues.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_portfolio_prioritization_engine_runbook](/tools/lookup-portfolio-prioritization-engine-runbook.md)

## Success rubric

CIO / CTO receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Portfolio Prioritization Engine Operations Runbook](/documents/portfolio-prioritization-engine-runbook.md)
