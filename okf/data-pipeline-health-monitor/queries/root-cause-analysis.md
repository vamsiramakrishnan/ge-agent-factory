---
type: Query Capability
title: "Trace failure through dependency graph. Identify root cause: upstream schema ..."
description: "Trace failure through dependency graph. Identify root cause: upstream schema change, data volume spike, infrastructure issue, or code regression. Check BigQuery information schema for recent changes."
source_id: "root-cause-analysis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Trace failure through dependency graph. Identify root cause: upstream schema change, data volume spike, infrastructure issue, or code regression. Check BigQuery information schema for recent changes.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_pipeline_health_monitor_runbook](/tools/lookup-data-pipeline-health-monitor-runbook.md)

## Runs in

- [root_cause_analysis](/workflow/root-cause-analysis.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Data Pipeline Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-pipeline-health-monitor-end-to-end.md)

# Citations

- [Data Pipeline Health Monitor Operations Runbook](/documents/data-pipeline-health-monitor-runbook.md)
