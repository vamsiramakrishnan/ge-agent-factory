---
type: Workflow Stage
title: Capacity Gap Scoring
description: "Compare labor_forecasts (forecast_hours, earned_hours_standard, minimum_coverage_hours) against BigQuery historical_metrics and analytics_events to score department-level coverage gaps and rank the DC Operations Manager's queue."
source_id: capacity_gap_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Capacity Gap Scoring

Compare labor_forecasts (forecast_hours, earned_hours_standard, minimum_coverage_hours) against BigQuery historical_metrics and analytics_events to score department-level coverage gaps and rank the DC Operations Manager's queue.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dc_labor_planning_engine_execution_playbook](/tools/lookup-dc-labor-planning-engine-execution-playbook.md)

Next: [Shift Plan & Flex-Labor Assembly](/workflow/shift-plan-flex-labor-assembly.md)
