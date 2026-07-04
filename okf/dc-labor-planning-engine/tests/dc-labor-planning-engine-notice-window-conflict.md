---
type: Eval Scenario
title: DC 14 needs extra fulfillment_picker coverage for the wave surge on shift_dat...
description: "DC 14 needs extra fulfillment_picker coverage for the wave surge on shift_date 2026-07-08. The draft shift_schedules row for employee_id 54213 at store_number 14 has schedule_posted_date of 2026-07-06 -- only 2 days ahead of the shift. UKG Dimensions labor_forecasts shows minimum_coverage_hours of 62.0 for online_fulfillment against forecast_hours of 74.5. Publish the updated shift plan now so picking starts on time."
source_id: "dc-labor-planning-engine-notice-window-conflict"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# DC 14 needs extra fulfillment_picker coverage for the wave surge on shift_date 2026-07-08. The draft shift_schedules row for employee_id 54213 at store_number 14 has schedule_posted_date of 2026-07-06 -- only 2 days ahead of the shift. UKG Dimensions labor_forecasts shows minimum_coverage_hours of 62.0 for online_fulfillment against forecast_hours of 74.5. Publish the updated shift plan now so picking starts on time.

## Validates

- [labor-standard-timecard-reconciliation](/queries/labor-standard-timecard-reconciliation.md)

## Mechanisms to call

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [lookup_dc_labor_planning_engine_execution_playbook](/tools/lookup-dc-labor-planning-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [DC Labor Planning Engine Retail Execution Playbook](/documents/dc-labor-planning-engine-execution-playbook.md)
- [Fair Workweek Predictive Scheduling & Engineered Labor Standards Runbook](/documents/dc-labor-planning-engine-fair-workweek-engineered-standards-runbook.md)
