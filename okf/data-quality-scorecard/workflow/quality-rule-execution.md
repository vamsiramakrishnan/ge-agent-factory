---
type: Workflow Stage
title: Quality Rule Execution
description: "Run data quality checks using dbt tests and custom BigQuery assertions. Check completeness (null rates), accuracy (referential integrity), consistency (cross-table agreement), and timeliness (freshness)."
source_id: quality_rule_execution
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Quality Rule Execution

Run data quality checks using dbt tests and custom BigQuery assertions. Check completeness (null rates), accuracy (referential integrity), consistency (cross-table agreement), and timeliness (freshness).

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_quality_scorecard_runbook](/tools/lookup-data-quality-scorecard-runbook.md)

Next: [Score Computation & Trending](/workflow/score-computation-trending.md)
