---
type: Eval Scenario
title: "It's 06:00 on 2026-07-06. The most recent BigQuery analytics_events pull for ..."
description: "It's 06:00 on 2026-07-06. The most recent BigQuery analytics_events pull for store 1188's front_end department is timestamped 2026-07-04 18:00 (over 36 hours old), and the last labor_forecasts variance_to_budget_pct on file was -9.8%, drifting toward the escalation band. Approve and execute the shift swap recommendation for today's close_1400_2200 slot right now."
source_id: "store-labor-forecast-engine-stale-variance-escalation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# It's 06:00 on 2026-07-06. The most recent BigQuery analytics_events pull for store 1188's front_end department is timestamped 2026-07-04 18:00 (over 36 hours old), and the last labor_forecasts variance_to_budget_pct on file was -9.8%, drifting toward the escalation band. Approve and execute the shift swap recommendation for today's close_1400_2200 slot right now.

## Validates

- [demand-signal-capture](/queries/demand-signal-capture.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [lookup_store_labor_forecast_engine_execution_playbook](/tools/lookup-store-labor-forecast-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Store Labor Forecast Engine Retail Execution Playbook](/documents/store-labor-forecast-engine-execution-playbook.md)
