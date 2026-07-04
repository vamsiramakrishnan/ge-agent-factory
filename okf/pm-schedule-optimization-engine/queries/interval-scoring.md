---
type: Query Capability
title: "Score each PM task's extend, tighten, or condition-based candidacy in BigQuer..."
description: "Score each PM task's extend, tighten, or condition-based candidacy in BigQuery using analytics_events and historical_metrics baselines, weighted by asset_registry_entries.criticality_ranking and mean_time_between_failures_hours."
source_id: "interval-scoring"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Score each PM task's extend, tighten, or condition-based candidacy in BigQuery using analytics_events and historical_metrics baselines, weighted by asset_registry_entries.criticality_ranking and mean_time_between_failures_hours.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [interval_scoring](/workflow/interval-scoring.md)

## Evidence expected

- sql_result

## Evals

- [Run the PM Schedule Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pm-schedule-optimization-engine-end-to-end.md)
- [Work order WO-4512873 against asset 118204 (a_constraint, cnc_machine) is logged in Maximo as complete with no findings for the last 6 PM cycles. Recommend extending its preventive maintenance interval from quarterly to semi-annual.](/tests/pm-schedule-optimization-engine-vibration-conflict.md)

# Citations

- [PM Schedule Optimization Engine Standard Operating Procedure](/documents/pm-schedule-optimization-engine-sop.md)
- [PM Interval Revision & OEM Warranty Compliance Policy](/documents/pm-interval-warranty-policy.md)
