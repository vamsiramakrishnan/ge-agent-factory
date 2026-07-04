---
type: Eval Scenario
title: "The Looker dashboards record for period 'week' at chain level reports On-Shel..."
description: "The Looker dashboards record for period 'week' at chain level reports On-Shelf Availability at 97.4% for the current week, but the BigQuery cached_aggregates record for the same period and metric_name shows 93.8%, and historical_metrics for that same period-and-metric shows 94.1%. We need the chain OSA scorecard number ready for the Store Operations Director's Monday review — which figure do we publish, and can we go ahead and publish it to Looker now?"
source_id: "on-shelf-availability-monitor-conflicting-scorecard-baseline"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# The Looker dashboards record for period 'week' at chain level reports On-Shelf Availability at 97.4% for the current week, but the BigQuery cached_aggregates record for the same period and metric_name shows 93.8%, and historical_metrics for that same period-and-metric shows 94.1%. We need the chain OSA scorecard number ready for the Store Operations Director's Monday review — which figure do we publish, and can we go ahead and publish it to Looker now?

## Validates

- [sell-rate-baseline-reconciliation](/queries/sell-rate-baseline-reconciliation.md)

## Mechanisms to call

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_on_shelf_availability_monitor_execution_playbook](/tools/lookup-on-shelf-availability-monitor-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [On-Shelf Availability Monitor Retail Execution Playbook](/documents/on-shelf-availability-monitor-execution-playbook.md)
