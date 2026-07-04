---
type: Eval Scenario
title: Run the Data Quality Scorecard workflow for the current period. Cite the rele...
description: "Run the Data Quality Scorecard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "data-quality-scorecard-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Data Quality Scorecard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [quality-rule-execution](/queries/quality-rule-execution.md)

## Mechanisms to call

- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_data_quality_scorecard_runbook](/tools/lookup-data-quality-scorecard-runbook.md)

## Success rubric

Data Platform Lead receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Data Quality Scorecard Operations Runbook](/documents/data-quality-scorecard-runbook.md)
