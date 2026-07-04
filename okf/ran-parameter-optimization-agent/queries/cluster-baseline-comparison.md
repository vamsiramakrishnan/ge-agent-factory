---
type: Query Capability
title: Compare current performance_counters against historical_metrics and analytics...
description: "Compare current performance_counters against historical_metrics and analytics_events in BigQuery to rank the worst-offending cell_sites by drop call rate and handover failure rate drift."
source_id: "cluster-baseline-comparison"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Compare current performance_counters against historical_metrics and analytics_events in BigQuery to rank the worst-offending cell_sites by drop call rate and handover failure rate drift.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [cluster_baseline_comparison](/workflow/cluster-baseline-comparison.md)

## Evidence expected

- sql_result

## Evals

- [Run the RAN Parameter Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ran-parameter-optimization-agent-end-to-end.md)
- [Site 14892 in the Dallas-Ft Worth market has a pending tilt increase from the coverage team (change ticket 2043211) queued for this Thursday's window, and performance_counters show PRB utilization already at 91% with an energy-saving power reduction applied to the same site last Tuesday. Recommend whether to proceed with the tilt change for this week's cluster review.](/tests/ran-parameter-optimization-agent-conflicting-parameter-changes.md)
- [Parameter change action ENM-88213 was pushed to cell 15630 four days ago to fix its VoLTE drop rate; the last performance_counters refresh for that cell is timestamped 2026-06-29 (5 days old) and cell_availability_pct hasn't updated since. Confirm whether the change held and can be closed out.](/tests/ran-parameter-optimization-agent-stale-verification-window.md)

# Citations

- [RAN Parameter Optimization Agent Service Assurance Runbook](/documents/ran-parameter-optimization-agent-assurance-runbook.md)
- [RAN Parameter Change Control & Rollback Playbook](/documents/ran-parameter-change-control-playbook.md)
