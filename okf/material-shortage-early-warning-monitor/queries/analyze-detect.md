---
type: Query Capability
title: Compare current state against historical baselines and analytics events in Bi...
description: "Compare current state against historical baselines and analytics events in BigQuery to detect gaps, score exceptions, and prioritize the Supply Planner's queue."
source_id: "analyze-detect"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Compare current state against historical baselines and analytics events in BigQuery to detect gaps, score exceptions, and prioritize the Supply Planner's queue.

## Tools used

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [analyze_detect](/workflow/analyze-detect.md)

## Evidence expected

- sql_result

## Evals

- [Run the Material Shortage Early Warning Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/material-shortage-early-warning-monitor-end-to-end.md)

# Citations

- [Material Shortage Early Warning Monitor Standard Operating Procedure](/documents/material-shortage-early-warning-monitor-sop.md)
