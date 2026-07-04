---
type: Workflow Stage
title: Root Cause Analysis
description: "Trace failure through dependency graph. Identify root cause: upstream schema change, data volume spike, infrastructure issue, or code regression. Check BigQuery information schema for recent changes."
source_id: root_cause_analysis
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Root Cause Analysis

Trace failure through dependency graph. Identify root cause: upstream schema change, data volume spike, infrastructure issue, or code regression. Check BigQuery information schema for recent changes.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_pipeline_health_monitor_runbook](/tools/lookup-data-pipeline-health-monitor-runbook.md)

Next: [Fix Proposal Generation](/workflow/fix-proposal-generation.md)
