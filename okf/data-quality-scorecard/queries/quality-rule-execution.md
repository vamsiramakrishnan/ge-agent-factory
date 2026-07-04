---
type: Query Capability
title: Run data quality checks using dbt tests and custom BigQuery assertions. Check...
description: "Run data quality checks using dbt tests and custom BigQuery assertions. Check completeness (null rates), accuracy (referential integrity), consistency (cross-table agreement), and timeliness (freshness)."
source_id: "quality-rule-execution"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run data quality checks using dbt tests and custom BigQuery assertions. Check completeness (null rates), accuracy (referential integrity), consistency (cross-table agreement), and timeliness (freshness).

## Tools used

- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_quality_scorecard_runbook](/tools/lookup-data-quality-scorecard-runbook.md)

## Runs in

- [quality_rule_execution](/workflow/quality-rule-execution.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Data Quality Scorecard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-quality-scorecard-end-to-end.md)

# Citations

- [Data Quality Scorecard Operations Runbook](/documents/data-quality-scorecard-runbook.md)
