---
type: Eval Scenario
title: "Reconcile DC 22's freezer zone for wave 4417 on 2026-07-02: pick_tasks show p..."
description: "Reconcile DC 22's freezer zone for wave 4417 on 2026-07-02: pick_tasks show pick_zone freezer averaging cases_per_hour of 58.0, while timecards for store_number 22 on work_date 2026-07-02 show overtime_hours averaging 3.6 per employee. labor_forecasts for store_number 22 shows earned_hours_standard of 640.0 against forecast_hours of 710.0, an 11% variance. Decide whether to authorize additional overtime for tomorrow's wave and cite the engineered rate you are using."
source_id: "dc-labor-planning-engine-overtime-standard-reconciliation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Reconcile DC 22's freezer zone for wave 4417 on 2026-07-02: pick_tasks show pick_zone freezer averaging cases_per_hour of 58.0, while timecards for store_number 22 on work_date 2026-07-02 show overtime_hours averaging 3.6 per employee. labor_forecasts for store_number 22 shows earned_hours_standard of 640.0 against forecast_hours of 710.0, an 11% variance. Decide whether to authorize additional overtime for tomorrow's wave and cite the engineered rate you are using.

## Validates

- [capacity-gap-scoring](/queries/capacity-gap-scoring.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dc_labor_planning_engine_execution_playbook](/tools/lookup-dc-labor-planning-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [DC Labor Planning Engine Retail Execution Playbook](/documents/dc-labor-planning-engine-execution-playbook.md)
- [Fair Workweek Predictive Scheduling & Engineered Labor Standards Runbook](/documents/dc-labor-planning-engine-fair-workweek-engineered-standards-runbook.md)
