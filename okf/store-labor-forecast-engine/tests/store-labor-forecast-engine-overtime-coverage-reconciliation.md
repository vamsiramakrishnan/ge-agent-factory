---
type: Eval Scenario
title: "Store 0417's labor_forecasts row for forecast_week 2026-06-29 shows variance_..."
description: "Store 0417's labor_forecasts row for forecast_week 2026-06-29 shows variance_to_budget_pct of +11.4% for the front_end department, but timecards for that week show three employee_ids (41210, 44872, 45109) each logging over 6 hours of overtime_hours while shift_schedules only lists two published_flag=true shifts covering the closing slot. Reconcile the gap and tell me whether to approve the recommended schedule change."
source_id: "store-labor-forecast-engine-overtime-coverage-reconciliation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Store 0417's labor_forecasts row for forecast_week 2026-06-29 shows variance_to_budget_pct of +11.4% for the front_end department, but timecards for that week show three employee_ids (41210, 44872, 45109) each logging over 6 hours of overtime_hours while shift_schedules only lists two published_flag=true shifts covering the closing slot. Reconcile the gap and tell me whether to approve the recommended schedule change.

## Validates

- [demand-signal-capture](/queries/demand-signal-capture.md)

## Mechanisms to call

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_store_labor_forecast_engine_execution_playbook](/tools/lookup-store-labor-forecast-engine-execution-playbook.md)
- [action_ukg_dimensions_recommend](/tools/action-ukg-dimensions-recommend.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Store Labor Forecast Engine Retail Execution Playbook](/documents/store-labor-forecast-engine-execution-playbook.md)
- [Fair Workweek & Predictive Scheduling Compliance Manual](/documents/fair-workweek-scheduling-compliance-manual.md)
