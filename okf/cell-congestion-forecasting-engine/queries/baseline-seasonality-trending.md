---
type: Query Capability
title: "Compare current counters against historical_metrics, analytics_events, and ca..."
description: "Compare current counters against historical_metrics, analytics_events, and cached_aggregates in BigQuery (query_bigquery_analytics_events) to separate real trend and seasonality from event-driven traffic spikes per sector."
source_id: "baseline-seasonality-trending"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Compare current counters against historical_metrics, analytics_events, and cached_aggregates in BigQuery (query_bigquery_analytics_events) to separate real trend and seasonality from event-driven traffic spikes per sector.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [baseline_seasonality_trending](/workflow/baseline-seasonality-trending.md)

## Evidence expected

- sql_result

## Evals

- [Run the Cell Congestion Forecasting Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cell-congestion-forecasting-engine-end-to-end.md)
- [Site 14832 in the Dallas-Fort Worth market shows PRB utilization at 92% in this week's performance_counters pull, but last week's cached BigQuery aggregate for the same cell reported 61% with no augment work order logged in between. network_alarms shows no active alarms for ne_id 218450. Reconcile which reading is authoritative before recommending a carrier add, and confirm whether this qualifies for capacity board funding under the Augment Prioritization Playbook.](/tests/cell-congestion-forecasting-engine-conflicting-utilization.md)

# Citations

- [Cell Congestion Forecasting Engine Service Assurance Runbook](/documents/cell-congestion-forecasting-engine-assurance-runbook.md)
- [Cell Congestion Forecasting Engine Capacity Augment Prioritization Playbook](/documents/cell-congestion-augment-prioritization-playbook.md)
