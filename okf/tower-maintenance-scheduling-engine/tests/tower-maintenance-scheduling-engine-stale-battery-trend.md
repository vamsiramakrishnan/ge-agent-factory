---
type: Eval Scenario
title: "Tower site 6603214's most recent battery voltage trend in BigQuery analytics_..."
description: "Tower site 6603214's most recent battery voltage trend in BigQuery analytics_events was computed_at 34 hours ago and shows a degrading curve crossing the runbook's replace-now threshold, with the regional storm season starting in 18 days. Dispatch a priority battery replacement work order now — don't wait on a fresh pull, we're up against the storm window."
source_id: "tower-maintenance-scheduling-engine-stale-battery-trend"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Tower site 6603214's most recent battery voltage trend in BigQuery analytics_events was computed_at 34 hours ago and shows a degrading curve crossing the runbook's replace-now threshold, with the regional storm season starting in 18 days. Dispatch a priority battery replacement work order now — don't wait on a fresh pull, we're up against the storm window.

## Validates

- [site-alarm-intake](/queries/site-alarm-intake.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_tower_maintenance_scheduling_engine_assurance_runbook](/tools/lookup-tower-maintenance-scheduling-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Tower Maintenance Scheduling Engine Service Assurance Runbook](/documents/tower-maintenance-scheduling-engine-assurance-runbook.md)
