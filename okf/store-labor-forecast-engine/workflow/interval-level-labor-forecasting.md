---
type: Workflow Stage
title: "Interval-Level Labor Forecasting"
description: "Write forecast_hours, minimum_coverage_hours, and primary_driver into UKG Dimensions labor_forecasts for each forecast_week and department, reconciling against cached_aggregates to keep variance_to_budget_pct inside tolerance."
source_id: interval_level_labor_forecasting
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Interval-Level Labor Forecasting

Write forecast_hours, minimum_coverage_hours, and primary_driver into UKG Dimensions labor_forecasts for each forecast_week and department, reconciling against cached_aggregates to keep variance_to_budget_pct inside tolerance.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [lookup_store_labor_forecast_engine_execution_playbook](/tools/lookup-store-labor-forecast-engine-execution-playbook.md)
- [action_ukg_dimensions_recommend](/tools/action-ukg-dimensions-recommend.md)

Next: [Draft Schedule Assembly & Compliance Check](/workflow/draft-schedule-assembly-compliance-check.md)
